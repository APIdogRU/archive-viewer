import type { IMessage } from '@apidog/vk-typings';

export enum FilterName {
    WITH_ATTACHMENTS,
}

export type FilterFunction = (message: IMessage) => boolean;

export const filterImpl: Record<FilterName, FilterFunction> = {
    [FilterName.WITH_ATTACHMENTS]: message => message.attachments !== undefined && message.attachments.length > 0,
};

export const filterNames: Record<FilterName, string> = {
    [FilterName.WITH_ATTACHMENTS]: 'только с прикреплениями',
};

export const allFilters: FilterName[] = [FilterName.WITH_ATTACHMENTS];
