import * as React from 'react';

import type { IFileChooserProps } from './FileChooser.typings';
import {
    fileChooserCn,
    fileChooserInputCn,
    fileChooserLabelCn,
} from './FileChooser.const';

import './FileChooser.scss';

export const FileChooser: React.FC<IFileChooserProps> = ({ label, onFileSelected: onChoose }) => {
    const inputId = React.useId();
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];

        if (file) {
            onChoose(file);
        }
    }, [onChoose]);

    return (
        <div className={fileChooserCn}>
            <input
                accept="application/json"
                className={fileChooserInputCn}
                id={inputId}
                type="file"
                onChange={onChange}
            />
            <label
                htmlFor={inputId}
                className={fileChooserLabelCn}
            >
                {label}
            </label>
        </div>
    );
}
