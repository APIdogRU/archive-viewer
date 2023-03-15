import type { IAccount } from '@apidog/vk-typings';
import { cn } from '@bem-react/classname';

const cnMessage = cn('Message');
export const messageCn = cnMessage();
export const messageAvatarCn = cnMessage('Avatar');
export const messagePhotoCn = cnMessage('Photo');
export const messageAuthorCn = cnMessage('Author');
export const messageBodyCn = cnMessage('Body');
export const messageTextCn = cnMessage('Text');
export const messageForwardedCn = cnMessage('Forwarded');
export const messageDateCn = cnMessage('Date');

export const defaultAccount = {
    first_name: 'unknown',
    last_name: 'user/group',
} as IAccount;
