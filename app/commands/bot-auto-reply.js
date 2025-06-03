import { TYPE_SYSTEM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_SYSTEM,
  label: t('__COMMAND_BOT_AUTO_REPLY_LABEL'),
  text: t('__COMMAND_BOT_AUTO_REPLY_TEXT'),
  reply: t('__COMMAND_BOT_AUTO_REPLY_REPLY'),
  aliases: [
    ...t('__COMMAND_BOT_AUTO_REPLY_ALIASES'),
    '/auto-reply',
    'AutoReply',
  ],
});
