import type { IAccount, IGroup } from '@apidog/vk-typings';

export function isGroupObject(obj: IAccount): obj is IGroup {
    return 'name' in obj;
}
