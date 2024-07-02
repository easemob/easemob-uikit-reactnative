import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import { GlobalContainer as CallKitContainer } from '../rename.callkit';
import {
  type ChatService,
  type ChatServiceListener,
  Container as UIKitContainer,
  useChatListener,
} from '../rename.uikit';
import { ToastView } from './common';
import { AvatarStatusRenderMemo } from './common/AvatarStatusRender';
import { AVView } from './common/AVView';
import {
  accountType,
  agoraAppId,
  appKey as gAppKey,
  boloo_da_ttf_name,
  isDevMode,
  restServer,
} from './common/const';
import { RestApi } from './common/rest.api';
import { useAutoLogin } from './hooks';
import { useApp } from './hooks/useApp';
import { useGeneralSetting } from './hooks/useGeneralSetting';
import { useServerConfig } from './hooks/useServerConfig';
import type { RootParamsList } from './routes';
import {
  AboutSettingScreen,
  AddGroupParticipantScreen,
  AVSelectGroupParticipantScreen,
  BlockListScreen,
  ChangeGroupOwnerScreen,
  ColorSettingScreen,
  ContactInfoScreen,
  ConversationDetailScreen,
  CreateGroupScreen,
  CreateThreadScreen,
  DelGroupParticipantScreen,
  EditInfoScreen,
  FeatureSettingScreen,
  FileMessagePreviewScreen,
  GeneralSettingScreen,
  GroupInfoScreen,
  GroupListScreen,
  GroupParticipantInfoScreen,
  GroupParticipantListScreen,
  HomeScreen,
  ImageMessagePreviewScreen,
  LanguageSettingScreen,
  LoginV2Screen,
  MessageForwardSelectorScreen,
  MessageHistoryListScreen,
  MessageSearchScreen,
  MessageThreadListScreen,
  MessageThreadMemberListScreen,
  NewConversationScreen,
  NewRequestScreen,
  NotificationSettingScreen,
  PersonInfoScreen,
  PrivacySettingScreen,
  SearchBlockScreen,
  SearchContactScreen,
  SearchConversationScreen,
  SearchGroupScreen,
  SelectSingleParticipantScreen,
  ServerSettingScreen,
  ShareContactScreen,
  SplashScreen,
  StyleSettingScreen,
  VideoMessagePreviewScreen,
} from './screens';

const Root = createNativeStackNavigator<RootParamsList>();

// SplashScreen?.preventAutoHideAsync?.();

export function App() {
  const {
    initialRouteName,
    paletteRef,
    dark,
    light,
    isLightRef,
    languageRef,
    translateLanguageRef,
    isNavigationReadyRef,
    isContainerReadyRef,
    isFontReadyRef,
    isReadyRef,
    enablePresenceRef,
    enableReactionRef,
    enableThreadRef,
    enableTranslateRef,
    enableAVMeetingRef,
    enableTypingRef,
    enableBlockRef,
    fontsLoaded,
    rootRef,
    imServerRef,
    imPortRef,
    enableDNSConfigRef,
    _initParams,
    setInitParams,
    releaseAreaRef,
    getOptions,
    enableOfflinePushRef,
    initPush,
    requestInviteContent,
    requestRTCToken,
    requestUserMap,
    requestCurrentUser,
    requestUserInfo,
    onInitLanguageSet,
    onStateChange,
    onUnhandledAction,
    onGroupsHandler,
    onUsersHandler,
    fontFamily,
  } = useApp();

  const { getEnableDNSConfig, getImPort, getImServer } = useServerConfig();
  const { initParams } = useGeneralSetting();
  const imRef = React.useRef<ChatService>();
  const { autoLoginAction } = useAutoLogin();

  const initParamsCallback = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      imPortRef.current = await getImPort();
      imServerRef.current = await getImServer();
      enableDNSConfigRef.current = await getEnableDNSConfig();
      const ret = await initParams();
      isLightRef.current = !ret.appTheme;
      releaseAreaRef.current = ret.appStyle === 'classic' ? 'china' : 'global';
      languageRef.current = ret.appLanguage === 'en' ? 'en' : 'zh-Hans';
      translateLanguageRef.current =
        ret.appTranslateLanguage === 'en' ? 'en' : 'zh-Hans';
      enablePresenceRef.current = ret.appPresence;
      enableReactionRef.current = ret.appReaction;
      enableThreadRef.current = ret.appThread;
      enableTranslateRef.current = ret.appTranslate;
      enableAVMeetingRef.current = ret.appAv;
      enableOfflinePushRef.current = ret.appNotification;
      enableTypingRef.current = ret.appTyping;
      enableBlockRef.current = ret.appBlock;
      console.log(
        'dev:init:params:',
        isLightRef.current,
        releaseAreaRef.current,
        languageRef.current,
        translateLanguageRef.current,
        enablePresenceRef.current,
        enableReactionRef.current,
        enableThreadRef.current,
        enableTranslateRef.current,
        enableAVMeetingRef.current,
        enableOfflinePushRef.current,
        enableTypingRef.current,
        enableBlockRef.current
      );
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [
    _initParams,
    enableAVMeetingRef,
    enableBlockRef,
    enableDNSConfigRef,
    enableOfflinePushRef,
    enablePresenceRef,
    enableReactionRef,
    enableThreadRef,
    enableTranslateRef,
    enableTypingRef,
    getEnableDNSConfig,
    getImPort,
    getImServer,
    imPortRef,
    imServerRef,
    initParams,
    isLightRef,
    languageRef,
    releaseAreaRef,
    setInitParams,
    translateLanguageRef,
  ]);

  const onReady = React.useCallback(
    async (_ready: boolean) => {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      // setTimeout(async () => {
      //   await SplashScreen.hideAsync();
      // }, 2000);
      if (isReadyRef.current === true) {
        return;
      }
      isReadyRef.current = true;

      if (accountType === 'agora') {
        RestApi.setBasicUrl('');
      }
      RestApi.setServer(restServer);

      await initPush();

      // await SplashScreen?.hideAsync?.();
      setTimeout(async () => {
        const ret = await imRef.current?.loginState();
        console.log('dev:loginState:', ret);
        if (ret === 'logged') {
          autoLoginAction({
            im: imRef.current!,
            onResult: (res) => {
              if (res.isOk) {
                rootRef.navigate('Home', {});
              } else {
                rootRef.navigate('LoginV2', {});
              }
            },
          });
        } else {
          rootRef.navigate('LoginV2', {});
        }
      }, 1000);
    },
    [isReadyRef, initPush, autoLoginAction, rootRef]
  );

  const onContainerInitialized = React.useCallback(
    (im: ChatService) => {
      imRef.current = im;
      isContainerReadyRef.current = true;
      if (
        isFontReadyRef.current === true &&
        isNavigationReadyRef.current === true &&
        isContainerReadyRef.current === true
      ) {
        onReady(true);
      }
    },
    [isContainerReadyRef, isFontReadyRef, isNavigationReadyRef, onReady]
  );

  const onNavigationInitialized = React.useCallback(() => {
    isNavigationReadyRef.current = true;
    if (
      isFontReadyRef.current === true &&
      isNavigationReadyRef.current === true &&
      isContainerReadyRef.current === true
    ) {
      onReady(true);
    }
  }, [isContainerReadyRef, isFontReadyRef, isNavigationReadyRef, onReady]);

  React.useEffect(() => {
    initParamsCallback().then().catch();
  }, [initParamsCallback]);

  React.useEffect(() => {
    if (fontsLoaded) {
      isFontReadyRef.current = true;
      if (
        isFontReadyRef.current === true &&
        isNavigationReadyRef.current === true &&
        isContainerReadyRef.current === true
      ) {
        console.log('dev:ready');
        onReady(true);
      }
    }
  }, [
    fontsLoaded,
    isContainerReadyRef,
    isFontReadyRef,
    isNavigationReadyRef,
    onReady,
  ]);

  if (_initParams === false) {
    // !!! This is a workaround for the issue that the app will not start if the
    // !!! `initParams` is not called in the `useEffect` hook.
    return null;
  }
  console.log('dev:app:');

  return (
    <React.StrictMode>
      <UIKitContainer
        options={getOptions()}
        palette={paletteRef.current}
        theme={isLightRef.current ? light : dark}
        language={languageRef.current}
        translateLanguage={translateLanguageRef.current}
        releaseArea={releaseAreaRef.current}
        enablePresence={enablePresenceRef.current}
        enableReaction={enableReactionRef.current}
        enableThread={enableThreadRef.current}
        enableTranslate={enableTranslateRef.current}
        enableAVMeeting={enableAVMeetingRef.current}
        enableTyping={enableTypingRef.current}
        enableBlock={enableBlockRef.current}
        enableMessageForward={true}
        enableMessageMultiSelect={true}
        enableMessageQuote={true}
        fontFamily={fontFamily}
        // formatTime={{
        //   locale: enAU,
        //   conversationDetailCallback(timestamp, enAU) {
        //     return format(timestamp, 'yyyy-MM-dd HH:mm:ss', { locale: enAU });
        //   },
        // }}
        // avatar={{
        //   personAvatar: defaultAvatars[2],
        //   groupAvatar: defaultAvatars[0],
        // }}
        headerFontFamily={boloo_da_ttf_name}
        // languageExtensionFactory={languageExtensionFactory}
        onInitialized={onContainerInitialized}
        onInitLanguageSet={onInitLanguageSet}
        onGroupsHandler={onGroupsHandler}
        onUsersHandler={onUsersHandler}
        AvatarStatusRender={AvatarStatusRenderMemo}
        // formatTime={formatTime}
        // recallTimeout={1200}
        // group={{ createGroupMemberLimit: 2 }}
      >
        <CallKitContainer
          option={{
            appKey: gAppKey,
            agoraAppId: agoraAppId,
          }}
          type={accountType as any}
          enableLog={isDevMode}
          requestRTCToken={requestRTCToken}
          requestUserMap={requestUserMap}
          requestCurrentUser={requestCurrentUser}
          requestUserInfo={requestUserInfo}
          requestInviteContent={requestInviteContent}
        >
          <NavigationContainer
            ref={rootRef}
            onStateChange={onStateChange}
            onUnhandledAction={onUnhandledAction}
            onReady={onNavigationInitialized}
            fallback={
              <View
                style={{ height: 100, width: 100, backgroundColor: 'red' }}
              />
            }
          >
            <Root.Navigator initialRouteName={initialRouteName}>
              <Root.Screen
                name={'Home'}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
                component={HomeScreen}
              />
              <Root.Screen
                name={'SearchConversation'}
                options={{
                  headerShown: false,
                }}
                component={SearchConversationScreen}
              />
              <Root.Screen
                name={'SearchContact'}
                options={{
                  headerShown: false,
                }}
                component={SearchContactScreen}
              />
              <Root.Screen
                name={'GroupList'}
                options={{
                  headerShown: false,
                }}
                component={GroupListScreen}
              />
              <Root.Screen
                name={'SearchGroup'}
                options={{
                  headerShown: false,
                }}
                component={SearchGroupScreen}
              />
              <Root.Screen
                name={'GroupParticipantList'}
                options={{
                  headerShown: false,
                }}
                component={GroupParticipantListScreen}
              />
              <Root.Screen
                name={'NewConversation'}
                options={{
                  headerShown: false,
                }}
                component={NewConversationScreen}
              />
              <Root.Screen
                name={'NewRequests'}
                options={{
                  headerShown: false,
                }}
                component={NewRequestScreen}
              />
              <Root.Screen
                name={'CreateGroup'}
                options={{
                  headerShown: false,
                }}
                component={CreateGroupScreen}
              />
              <Root.Screen
                name={'ContactInfo'}
                options={{
                  headerShown: false,
                }}
                component={ContactInfoScreen}
              />
              <Root.Screen
                name={'GroupInfo'}
                options={{
                  headerShown: false,
                }}
                component={GroupInfoScreen}
              />
              <Root.Screen
                name={'GroupParticipantInfo'}
                options={{
                  headerShown: false,
                }}
                component={GroupParticipantInfoScreen}
              />
              <Root.Screen
                name={'AddGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={AddGroupParticipantScreen}
              />
              <Root.Screen
                name={'DelGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={DelGroupParticipantScreen}
              />
              <Root.Screen
                name={'ChangeGroupOwner'}
                options={{
                  headerShown: false,
                }}
                component={ChangeGroupOwnerScreen}
              />
              <Root.Screen
                name={'ConversationDetail'}
                options={{
                  headerShown: false,
                }}
                component={ConversationDetailScreen}
              />
              <Root.Screen
                name={'SelectSingleParticipant'}
                options={{
                  headerShown: false,
                }}
                component={SelectSingleParticipantScreen}
              />
              <Root.Screen
                name={'FileMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={FileMessagePreviewScreen}
              />
              <Root.Screen
                name={'ImageMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={ImageMessagePreviewScreen}
              />
              <Root.Screen
                name={'VideoMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={VideoMessagePreviewScreen}
              />
              <Root.Screen
                name={'ShareContact'}
                options={{
                  headerShown: false,
                }}
                component={ShareContactScreen}
              />
              <Root.Screen
                name={'EditInfo'}
                options={{
                  headerShown: false,
                }}
                component={EditInfoScreen}
              />
              <Root.Screen
                name={'CreateThread'}
                options={{
                  headerShown: false,
                }}
                component={CreateThreadScreen}
              />
              <Root.Screen
                name={'MessageThreadDetail'}
                options={{
                  headerShown: false,
                }}
                component={ConversationDetailScreen}
              />
              <Root.Screen
                name={'MessageThreadList'}
                options={{
                  headerShown: false,
                }}
                component={MessageThreadListScreen}
              />
              <Root.Screen
                name={'MessageThreadMemberList'}
                options={{
                  headerShown: false,
                }}
                component={MessageThreadMemberListScreen}
              />
              <Root.Screen
                name={'MessageForwardSelector'}
                options={{
                  headerShown: false,
                }}
                component={MessageForwardSelectorScreen}
              />
              <Root.Screen
                name={'MessageHistoryList'}
                options={{
                  headerShown: false,
                }}
                component={MessageHistoryListScreen}
              />
              <Root.Screen
                name={'MessageSearch'}
                options={{
                  headerShown: false,
                }}
                component={MessageSearchScreen}
              />
              <Root.Screen
                name={'MessageHistory'}
                options={{
                  headerShown: false,
                }}
                component={ConversationDetailScreen}
              />
              <Root.Screen
                name={'Splash'}
                options={{
                  headerShown: false,
                }}
                component={SplashScreen}
              />
              <Root.Screen
                name={'LoginV2'}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
                component={LoginV2Screen}
              />
              <Root.Screen
                name={'LoginV2Setting'}
                options={{
                  headerShown: false,
                }}
                component={ServerSettingScreen}
              />
              <Root.Screen
                name={'AVSelectGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={AVSelectGroupParticipantScreen}
              />
              <Root.Screen
                name={'PersonInfo'}
                options={{
                  headerShown: false,
                }}
                component={PersonInfoScreen}
              />
              <Root.Screen
                name={'CommonSetting'}
                options={{
                  headerShown: false,
                }}
                component={GeneralSettingScreen}
              />
              <Root.Screen
                name={'LanguageSetting'}
                options={{
                  headerShown: false,
                }}
                component={LanguageSettingScreen}
              />
              <Root.Screen
                name={'TranslationLanguageSetting'}
                options={{
                  headerShown: false,
                }}
                component={LanguageSettingScreen}
              />
              <Root.Screen
                name={'ColorSetting'}
                options={{
                  headerShown: false,
                }}
                component={ColorSettingScreen}
              />
              <Root.Screen
                name={'StyleSetting'}
                options={{
                  headerShown: false,
                }}
                component={StyleSettingScreen}
              />
              <Root.Screen
                name={'AboutSetting'}
                options={{
                  headerShown: false,
                }}
                component={AboutSettingScreen}
              />
              <Root.Screen
                name={'FeatureSetting'}
                options={{
                  headerShown: false,
                }}
                component={FeatureSettingScreen}
              />
              <Root.Screen
                name={'NotificationSetting'}
                options={{
                  headerShown: false,
                }}
                component={NotificationSettingScreen}
              />
              <Root.Screen
                name={'SearchBlock'}
                options={{
                  headerShown: false,
                }}
                component={SearchBlockScreen}
              />
              <Root.Screen
                name={'BlockList'}
                options={{
                  headerShown: false,
                }}
                component={BlockListScreen}
              />
              <Root.Screen
                name={'PrivacySetting'}
                options={{
                  headerShown: false,
                }}
                component={PrivacySettingScreen}
              />
            </Root.Navigator>
          </NavigationContainer>

          <AVView />
        </CallKitContainer>

        {/* <TestListener /> */}
        <ToastView />
      </UIKitContainer>
    </React.StrictMode>
  );
}

export function TestListener() {
  useChatListener(
    React.useMemo(() => {
      return {
        onError: (params) => {
          console.log('dev:app:onError:', JSON.stringify(params));
        },
        onFinished: (params) => {
          console.log('dev:app:onFinished:', params);
        },
      } as ChatServiceListener;
    }, [])
  );
  return <></>;
}
