import * as React from 'react';

import { loadSpinnerCn, loadSpinnerRoundCn } from './LoadSpinner.const';

import './LoadSpinner.scss';

export const LoadSpinner: React.FC = () => (
    <div className={loadSpinnerCn}>
        <div className={loadSpinnerRoundCn} />
    </div>
);
