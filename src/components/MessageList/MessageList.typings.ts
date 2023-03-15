import type { IMessage } from '@apidog/vk-typings';

import type { IAccountMap } from '@typings/IAccountMap';

export interface IMessageListProps {
    messages: IMessage[];
    accounts: IAccountMap;
    depth?: number;
}
