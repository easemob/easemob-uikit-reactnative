#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "generated/RNChatCallkitSpec/RNChatCallkitSpec.h"

@interface ChatCallkit : NSObject <NativeChatCallkitSpec>

#else

#import <React/RCTBridgeModule.h>

@interface ChatCallkit : RCTEventEmitter <RCTBridgeModule>

#endif

@end
