import * as React from 'react';
import './FileChooser.scss';

export type IFileChooserDone = (file: File) => any;

export interface IFileChooserProps {
    label: string;
    onChoose: IFileChooserDone;
}

export default class FileChooser extends React.Component<IFileChooserProps> {

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        if (file) {
            this.props.onChoose(file);
        }
    };

    render() {
        return (
            <div className="file-chooser">
                <input
                    accept="application/json"
                    className="file-chooser__input"
                    id="contained-button-file"
                    type="file"
                    onChange={this.onChange} />
                <label
                    htmlFor="contained-button-file"
                    className="file-chooser__label">
                    {this.props.label}
                </label>
            </div>
        );
    }
}
