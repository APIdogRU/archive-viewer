import * as React from 'react';
import './FileChooser.scss';

export type IFileChooserDone = (file: File) => any;

export type IFileChooserProps = {
    label: string;
    onChoose: IFileChooserDone;
};

const FileChooser: React.FC<IFileChooserProps> = (props: IFileChooserProps) => {
    const onChange = React.useMemo(() => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files[0];
            if (file) {
                props.onChoose(file);
            }
        };
    }, [props.onChoose]);

    return (
        <div className="file-chooser">
            <input
                accept="application/json"
                className="file-chooser__input"
                id="contained-button-file"
                type="file"
                onChange={onChange} />
            <label
                htmlFor="contained-button-file"
                className="file-chooser__label">
                {props.label}
            </label>
        </div>
    );
}

export default FileChooser;
