#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "generated/RNChatUikitSpec/RNChatUikitSpec.h"

@interface ChatUikit : NSObject <NativeChatUikitSpec>

#else

#import <React/RCTBridgeModule.h>

@interface ChatUikit : RCTEventEmitter <RCTBridgeModule>

#endif

@end
