
const intlDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
const intlDateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' });

export function formatDate(unixtime: number, onlyDate = true): string {
    return (onlyDate ? intlDate : intlDateTime).format(new Date(unixtime * 1000));
}
