import * as React from 'react';
import * as Sugar from 'sugar';

import './DateHeader.scss';

interface IDateHeaderProps {
    date: Date;
}

export const DateHeader: React.FC<IDateHeaderProps> = ({ date }) => {
    const dateString = React.useMemo(() => Sugar.Date.medium(date, 'ru'), [date]);
    return (
        <div className="MessageList-DateHeader">{dateString}</div>
    );
};
