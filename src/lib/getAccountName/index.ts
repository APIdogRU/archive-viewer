import type { IAccount } from '@apidog/vk-typings';

export function getAccountName(account: IAccount | undefined): string {
    if (account === undefined || account === null) {
        return 'Unknown Account';
    }

    return 'name' in account
        ? account.name
        : `${account.first_name} ${account.last_name}`;
}
