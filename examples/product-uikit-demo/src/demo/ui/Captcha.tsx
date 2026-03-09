import React, { useRef, useCallback } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
// (crypto-js will be required dynamically to avoid type issues)
import WebView from 'react-native-webview';
import crypto from 'react-native-quick-crypto';

import { aliyunSecretKey } from '../common/const';
import { base64Utils } from '../utils/utils';

export type CaptchaProps = {
  containerStyle?: StyleProp<ViewStyle>;
  phone: string;
  onSuccess: () => void;
  onFail: (code: number, errorInfo?: string) => void;
};

export function Captcha(props: CaptchaProps) {
  const { containerStyle, phone, onSuccess, onFail } = props;

  const webViewRef = useRef<WebView>(null);

  /** 与 Android 侧保持一致的 Base64 编码 AES 密钥，请替换为真实值 */
  const SECRET_KEY_BASE64 = aliyunSecretKey;

  // 具体密钥的实现
  const encryptWithKey = useCallback(
    (plainText: string) => {
      try {
        // 解析 Base64 密钥
        const keyBytes = base64Utils.decode(SECRET_KEY_BASE64);

        // 输出密钥长度，帮助确认应该使用哪种AES变体
        console.log('Key length in bytes:', keyBytes.length);
        // 根据密钥长度确定AES变体
        const aesVariant =
          keyBytes.length === 32
            ? 'aes-256-gcm'
            : keyBytes.length === 24
              ? 'aes-192-gcm'
              : 'aes-128-gcm';
        console.log('Using AES variant:', aesVariant);

        // 生成随机 IV (12 字节，与Flutter实现一致)
        const iv = crypto.randomBytes(12);

        // 创建 GCM 加密器
        const cipher = crypto.createCipheriv(aesVariant, keyBytes, iv);

        // 加密数据
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // 获取认证标签
        const authTag = cipher.getAuthTag();

        // 组合 IV 和密文 (与Flutter实现一致)
        // 将Base64编码的加密数据转回二进制
        const encryptedBytes = base64Utils.decode(encrypted);

        // 组合IV、加密数据和认证标签
        const combined = new Uint8Array(
          iv.length + encryptedBytes.length + authTag.length
        );
        combined.set(iv, 0);
        combined.set(encryptedBytes, iv.length);
        combined.set(authTag, iv.length + encryptedBytes.length);

        // 将组合数据转为Base64
        return base64Utils.encode(combined);
      } catch (e) {
        console.warn('encryptWithKey failed', e);
        return '';
      }
    },
    [SECRET_KEY_BASE64]
  );

  const handleSuccess = useCallback(() => {
    console.log('handleSuccess');
    onSuccess();
  }, [onSuccess]);

  const handleError = useCallback(
    (code: number, errorInfo?: string) => {
      console.log('handleError', code, errorInfo);
      onFail(code, errorInfo);
    },
    [onFail]
  );

  const handleVerifyResult = useCallback(
    (verifyResult: string | object) => {
      let code = -1;
      try {
        // Handle both string and object inputs
        const json =
          typeof verifyResult === 'string'
            ? JSON.parse(verifyResult)
            : verifyResult;

        code = json.code;
        if (code === 200) {
          handleSuccess();
        } else {
          handleError(code, json.errorInfo);
        }
      } catch (e: any) {
        handleError(code, `PARSE_ERROR: ${e.message}`);
      }
    },
    [handleSuccess, handleError]
  );

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('test:data:', data);
        switch (data.type) {
          case 'encryptData': {
            const encrypted = encryptWithKey(data.param);
            webViewRef.current?.injectJavaScript(
              `window.encryptCallback && window.encryptCallback('${encrypted}'); true;`
            );
            break;
          }
          case 'verifyResult':
            handleVerifyResult(data.verifyResult);
            break;
          default:
            console.log('Unknown message from WebView', data);
        }
      } catch (e) {
        console.warn('Failed to parse message from WebView', e);
      }
    },
    [encryptWithKey, handleVerifyResult]
  );

  const bridgeInjection = `

    // -------- android webview --------
    if (!window.android) window.android = {};
    window.android.encryptData = function (param) {
      console.log('test:param:', param);
      window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'encryptData', param })
        );
    };
    window.android.getVerifyResult = function (verifyResult) {
      console.log('test:verifyResult:', verifyResult);
      window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'verifyResult', verifyResult })
        );
    };

    // -------- iOS webkit --------
    if (!window.webkit) window.webkit = {};
    if (!window.webkit.messageHandlers) window.webkit.messageHandlers = {};

    ['encryptData', 'getVerifyResult'].forEach(function (name) {
      if (!window.webkit.messageHandlers[name]) {
        window.webkit.messageHandlers[name] = {
          postMessage: function (payload) {
            console.log('test:payload:', payload);
            if (name === 'encryptData') {
              window.android.encryptData(payload);
            } else if (name === 'getVerifyResult') {
              window.android.getVerifyResult(payload);
            }
          },
        };
      }
    });
  `;

  return (
    <View
      style={[
        containerStyle,
        {
          // backgroundColor: 'red',
          // margin: 16,
          padding: 16,
          borderRadius: 8,
        },
      ]}
    >
      {/* <View
        style={{
          backgroundColor: 'blue',
          height: 26,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>123</Text>
      </View> */}

      <WebView
        source={{
          uri: `https://downloadsdk.easesdk.com/downloads/IMDemo/sms/index.html?telephone=${phone}`,
        }}
        // source={{ uri: "https://birchlabs.co.uk/linguabrowse/infopages/obsol/rnw_iframe_test.html" }}
        automaticallyAdjustContentInsets={false}
        // style={[containerStyle]}
        ref={webViewRef}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        injectedJavaScriptForMainFrameOnly={false}
        injectedJavaScriptBeforeContentLoaded={bridgeInjection}
      />
    </View>
  );
}
