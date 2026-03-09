#import "ChatRoomView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/ChatRoomViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/ChatRoomViewSpec/Props.h>
#import <react/renderer/components/ChatRoomViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation ChatRoomView {
    UIView * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ChatRoomViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ChatRoomViewProps>();
    _props = defaultProps;

    _view = [[UIView alloc] init];

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ChatRoomViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ChatRoomViewProps const>(props);

    if (oldViewProps.color != newViewProps.color) {
        [_view setBackgroundColor: RCTUIColorFromSharedColor(newViewProps.color)];
    }

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> ChatRoomViewCls(void)
{
  return ChatRoomView.class;
}
