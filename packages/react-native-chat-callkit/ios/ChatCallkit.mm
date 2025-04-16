#import "ChatCallkit.h"

@implementation ChatCallkit

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_MODULE()
#else
RCT_EXPORT_MODULE(ChatCallkit)
#endif

#ifdef RCT_NEW_ARCH_ENABLED

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeChatCallkitSpecJSI>(params);
}


- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);
    return result;
}

- (void)addListener:(NSString *)eventName {
    // Required for RN built in Event Emitter Calls
}

- (void)removeListeners:(double)count {
    // Required for RN built in Event Emitter Calls
}

#else

// Example method - synchronous version
// See // https://reactnative.dev/docs/native-modules-ios
// 同步方法 RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD
// 异步方法 RCT_EXPORT_METHOD
RCT_EXPORT_METHOD(multiply:(double)a b:(double)b) {
    NSNumber *result = @(a * b);
    return result;
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
    // Required for RN built in Event Emitter Calls
}

RCT_EXPORT_METHOD(removeListeners:(NSInteger)count) {
    // Required for RN built in Event Emitter Calls
}

#endif

@end
