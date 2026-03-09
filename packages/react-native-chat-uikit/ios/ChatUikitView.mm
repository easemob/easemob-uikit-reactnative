#import "ChatUikitView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/ChatUikitViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/ChatUikitViewSpec/Props.h>
#import <react/renderer/components/ChatUikitViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation ChatUikitView {
    UIView * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ChatUikitViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ChatUikitViewProps>();
    _props = defaultProps;

    _view = [[UIView alloc] init];

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ChatUikitViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ChatUikitViewProps const>(props);

    if (oldViewProps.color != newViewProps.color) {
        [_view setBackgroundColor: RCTUIColorFromSharedColor(newViewProps.color)];
    }

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> ChatUikitViewCls(void)
{
  return ChatUikitView.class;
}
