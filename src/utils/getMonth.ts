const months = 'январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь'.split(' ');

export default (month: number): string => {
    return months[month];
}
