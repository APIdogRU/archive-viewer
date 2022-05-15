import type { IGroup, IUser } from '@apidog/vk-typings';

export default function isGroupObject(obj: IUser | IGroup): obj is IGroup {
    return 'name' in obj;
}
