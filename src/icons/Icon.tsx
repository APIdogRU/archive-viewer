import * as React from 'react';
import './style.scss';

export interface IIconProps {
    icon: string;
}

export class Icon extends React.Component<IIconProps> {
    render() {
        return (
            <svg
                className="mdicon"
                viewBox="0 0 24 24"
                role="presentation">
                <path d={this.props.icon} />
            </svg>
        );
    }
}
