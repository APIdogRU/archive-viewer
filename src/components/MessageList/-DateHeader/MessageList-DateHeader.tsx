import * as React from 'react';

import { formatDate } from '@lib/formatDate';

import { messageListDateHeaderCn } from './MessageList-DateHeader.const';
import type { IMessageListDateHeaderProps } from './MessageList-DateHeader.typings';

import './MessageList-DateHeader.scss';

export const DateHeader: React.FC<IMessageListDateHeaderProps> = React.memo(({ date }) => (
    <div className={messageListDateHeaderCn}>
        {formatDate(date, true)}
    </div>
), (prev, next) => prev.date === next.date);
