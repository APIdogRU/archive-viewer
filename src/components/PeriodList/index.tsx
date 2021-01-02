import * as React from 'react';
import MessageController from '../../storage/MessageController';
import { IPeriodInfo } from '../../typings/types';
import getMonth from '../../utils/getMonth';
import classNames from 'classnames';

export type OnPeriodChanged = (period: IPeriodInfo) => any;

export interface IPeriodListProps {
    onPeriodChanged: OnPeriodChanged;
    selected: string;
    controller: MessageController;
}

const PeriodList: React.FC<IPeriodListProps> = (props: IPeriodListProps) => {
    const { selected, controller, onPeriodChanged } = props;

    const periods = controller.getPeriods();

    const nodes = [];

    const listener = (period: IPeriodInfo) => () => onPeriodChanged(period);

    let lastYear = 0;

    // дичь с циклом нужна для вывода шапок с годами
    for (const period of periods) {
        const { year, month, count } = period;
        const id = `${year}_${month}`;

        if (lastYear !== year) {
            nodes.push(
                <div
                    key={year}
                    className="viewer-period-year">
                    {year}
                </div>
            );
            lastYear = year;
        }

        nodes.push(
            <div
                key={id}
                className={classNames('viewer-period-item', selected === id && 'viewer-period-item__active')}
                onClick={listener(period)}
                data-count={count}>
                {getMonth(month)} {year}
            </div>
        );
    }

    return (
        <>{nodes}</>
    );
}

export default PeriodList;
