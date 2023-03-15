import * as React from 'react';

import type { ICheckboxProps } from './Checkbox.typings';
import { checkboxBoxCn, checkboxCn, checkboxLabelCn } from './Checkbox.const';

import './Checkbox.scss';

export const Checkbox: React.FC<ICheckboxProps> = ({ name, label, checked, setChecked }) => {
    const onChange = React.useCallback(() => {
        setChecked(checked);
    }, [setChecked, checked]);
    return (
        <label className={checkboxCn}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className={checkboxBoxCn}
            />
            <span className={checkboxLabelCn}>{label}</span>
        </label>
    );
};
