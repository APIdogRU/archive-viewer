import * as React from 'react';

import './Checkbox.scss';

interface ICheckboxProps {
    name: string;
    label: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
}

export const Checkbox: React.FC<ICheckboxProps> = ({ name, label, checked, setChecked }) => {
    const onChange = React.useCallback(() => {
        setChecked(checked);
    }, [setChecked, checked]);
    return (
        <label className="Checkbox">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="Checkbox-Box"
            />
            <span className="Checkbox-Label">{label}</span>
        </label>
    );
};
