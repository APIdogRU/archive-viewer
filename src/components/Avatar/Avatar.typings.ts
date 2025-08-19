import type { IAccount } from '@apidog/vk-typings';

export interface IAvatarProps {
    info: IAccount;
    size: 's' | 'm' | 'l';
    alt?: string;
    className?: string;
}
