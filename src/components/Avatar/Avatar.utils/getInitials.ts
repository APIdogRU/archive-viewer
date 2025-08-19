import type { IAccount } from '@apidog/vk-typings';

export function getInitials(info: IAccount): string {
    let firstName: string;
    let lastName: string;

    if ('name' in info) {
        [firstName, lastName = ''] = info.name.split(' ').slice(0, 2);
    } else {
        ({ first_name: firstName, last_name: lastName } = info);
    }

    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}
