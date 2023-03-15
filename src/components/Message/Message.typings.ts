import type { IMessage } from '@apidog/vk-typings';

import type { IAccountMap } from '@typings/IAccountMap';

export interface IMessageProps {
    accounts: IAccountMap;
    message: IMessage;
    depth?: number;
}
