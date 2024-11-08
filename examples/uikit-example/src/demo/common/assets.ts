import { accountType } from './const';

const _logo = {
  agora: require('../../../assets/agora_logo_3x.png'),
  easemob: require('../../../assets/logo_3x.png'),
};
const _about_logo = {
  agora: require('../../../assets/agora_about_logo.png'),
  easemob: require('../../../assets/about_logo.png'),
};

export const logo = accountType === 'agora' ? _logo.agora : _logo.easemob;
export const about_logo =
  accountType === 'agora' ? _about_logo.agora : _about_logo.easemob;
export const main_bg = require('../../../assets/main_bg.png');
export const main_bg_dark = require('../../../assets/main_bg_dark.png');
export const boloo_da_ttf = require('../../../assets/fonts/BalooDa-Regular.ttf');
export const twemoji_ttf = require('../../../assets/fonts/Twemoji.Mozilla.ttf');

export const avatar_status_leave = require('../assets/avatar_status/leave_3x.png');
export const avatar_status_custom = require('../assets/avatar_status/custom_3x.png');
export const avatar_status_no_disturb = require('../assets/avatar_status/no_disturb_3x.png');

export const attr_msg_style1_ondark = require('../assets/attmsg_style1/ondark_3x.png');
export const attr_msg_style1_onlight = require('../assets/attmsg_style1/onlight_3x.png');
export const attr_msg_style2_ondark = require('../assets/attmsg_style2/ondark_3x.png');
export const attr_msg_style2_onlight = require('../assets/attmsg_style2/onlight_3x.png');
export const msg_menu_style1_ondark = require('../assets/msgmenu_style1/ondark_3x.png');
export const msg_menu_style1_onlight = require('../assets/msgmenu_style1/onlight_3x.png');
export const msg_menu_style2_ondark = require('../assets/msgmenu_style2/ondark_3x.png');
export const msg_menu_style2_onlight = require('../assets/msgmenu_style2/onlight_3x.png');
