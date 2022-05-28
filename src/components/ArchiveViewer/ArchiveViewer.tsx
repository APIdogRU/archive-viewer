import * as React from 'react';

import type { IArchiveComposite } from '@typings/IArchiveComposite';
import type { IPeriodInfo } from '@typings/IPeriodInfo';
import { PeriodPanel } from '@components/PeriodPanel/PeriodPanel';
import { MessageList } from '@components/MessageList/MessageList';

import './ArchiveViewer.scss';

type IArchiveViewerProps = IArchiveComposite;

export const ArchiveViewer: React.FC<IArchiveViewerProps> = ({ archive, accounts, index }) => {
    const [period, setPeriod] = React.useState<IPeriodInfo | undefined>(undefined);

    return (
        <div className="Viewer">
            <div className="Viewer-Period">
                <PeriodPanel
                    current={period}
                    periods={index.periods}
                    setPeriod={setPeriod}
                />
            </div>
            <div className="Viewer-Content">
                {period ? (
                    <MessageList
                        messages={archive.data.slice(period.range[0], period.range[1])}
                        accounts={accounts}
                    />
                ) : 'Выберите промежуток'}
            </div>
        </div>
    );
};

/* <div className="app-page__view viewer">
    <div className="viewer-content">
        <div className="viewer-period">
            <PeriodList
                onPeriodChanged={this.onPeriodChanged}
                selected={this.getCurrentPeriod()}
                controller={messages} />
        </div>
        <div className="viewer-list">
            {settings.year ? (
                <MessageList
                    messages={this.getMessages()}
                    getUser={messages.getUserById}
                    depth={0} />
            ) : (
                <p>Выберите период</p>
            )}
        </div>
    </div>
    <div className="viewer-controls">
        <label className="control">
            <input
                type="checkbox"
                className="control-input"
                checked={settings.showOnly === TMessageViewFilter.WITH_ATTACHMENTS}
                onChange={this.onChangeOnlyWithAttachments} />
            <span className="control-label">Только с прикреплениями</span>
        </label>
    </div>
</div>*/
