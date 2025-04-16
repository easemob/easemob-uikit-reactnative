#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "generated/RNChatRoomSpec/RNChatRoomSpec.h"

@interface ChatRoom : RCTEventEmitter <NativeChatRoomSpec>

#else

#import <React/RCTBridgeModule.h>

@interface ChatRoom : RCTEventEmitter <RCTBridgeModule>

#endif

@end
