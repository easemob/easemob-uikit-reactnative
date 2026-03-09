#import "ChatCallkitView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/ChatCallkitViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/ChatCallkitViewSpec/Props.h>
#import <react/renderer/components/ChatCallkitViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation ChatCallkitView {
    UIView * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ChatCallkitViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ChatCallkitViewProps>();
    _props = defaultProps;

    _view = [[UIView alloc] init];

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ChatCallkitViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ChatCallkitViewProps const>(props);

    if (oldViewProps.color != newViewProps.color) {
        [_view setBackgroundColor: RCTUIColorFromSharedColor(newViewProps.color)];
    }

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> ChatCallkitViewCls(void)
{
  return ChatCallkitView.class;
}
