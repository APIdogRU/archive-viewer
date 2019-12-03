import * as React from 'react';
import MessageController from '../../storage/MessageController';
import { IPeriodInfo } from '../../typings/types';
import getMonth from '../../utils/getMonth';

export type OnPeriodChanged = (period: IPeriodInfo) => any;

export interface IPeriodListProps {
    onPeriodChanged: OnPeriodChanged;
    selected: string;
    controller: MessageController;
}

export default class PeriodList extends React.Component<IPeriodListProps> {

    render() {
        const { selected, controller, onPeriodChanged } = this.props;
        const periods = controller.getPeriods();

        const nodes = [];

        const listener = (period: IPeriodInfo) => () => onPeriodChanged(period);


        let lastYear = 0;
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

            let cls = ['viewer-period-item'];

            if (selected === id) {
                cls.push('viewer-period-item__active');
            }

            nodes.push(
                <div
                    key={id}
                    className={cls.join(' ')}
                    onClick={listener(period)}
                    data-count={count}>
                    {getMonth(month)} {year}
                </div>
            );
        }

        return nodes;
    }


}