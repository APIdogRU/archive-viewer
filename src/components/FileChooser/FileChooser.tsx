import * as React from 'react';

import './FileChooser.scss';

export type FileChooserCallback = (file: File) => void;

interface IFileChooserProps {
    label: string;
    onFileSelected: FileChooserCallback;
}

export const FileChooser: React.FC<IFileChooserProps> = ({ label, onFileSelected: onChoose }) => {
    const inputId = React.useId();
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];

        if (file) {
            onChoose(file);
        }
    }, [onChoose]);

    return (
        <div className="FileChooser">
            <input
                accept="application/json"
                className="FileChooser-Input"
                id={inputId}
                type="file"
                onChange={onChange} />
            <label
                htmlFor={inputId}
                className="FileChooser-Label">
                {label}
            </label>
        </div>
    );
}
