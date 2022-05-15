import * as React from 'react';
import ArchiveFile from '@utils/ArchiveFile';
import migration1to2 from '@utils/migration1to2';
import MessageList from '@components/MessageList';
import FileChooser from '@components/FileChooser';
import LoadSpinner from '@components/LoadSpinner';
import PeriodList from '@components/PeriodList';
import MessageController from './storage/MessageController';
import { IPeriodInfo, TMessageViewFilter, IMessageViewSettings } from '@typings/types';

export enum AppStage {
    SELECT_FILE,
    PARSING,
    VIEW
}

const APP_VERSION = process.env.VERSION;
const YEAR_RELEASE = process.env.YEAR;

export type IAppProps = {};

export interface IAppState {
    stage: AppStage;
    error: Error | null;
    messages: MessageController | null;
    settings: IMessageViewSettings;
}

export default class App extends React.Component<IAppProps, IAppState> {
    override state: IAppState = {
        stage: AppStage.SELECT_FILE,
        error: null,
        messages: null,
        settings: {
            showOnly: TMessageViewFilter.ALL
        },
    };

    /**
     * Обработчик событий выбора файла
     */
    private onFileChosen = async(file: File) => {
        this.setState({ stage: AppStage.PARSING });

        console.log('Loading file...');

        try {
            const af = new ArchiveFile(file);
            await af.read();

            if (af.meta.v < '2.0') {
                console.log(`Detected deprecated version ${af.meta.v}. Trying to convert`);

                af.process(migration1to2);

                console.log('Converted to 2.0');
            }

            const msgCtl = new MessageController();
            await msgCtl.readFromArchive(af.root);

            this.setState({
                stage: AppStage.VIEW,
                messages: msgCtl
            });
        } catch (error) {
            this.setState({ error: error as Error });
        }
    }

    /**
     * Текущий просматриваемый период в виде тега
     */
    private getCurrentPeriod = () => {
        const { year, month } = this.state.settings;
        return `${year}_${month}`;
    }

    /**
     * Обработчик события изменения просматриваемого периода
     */
    private onPeriodChanged = (period: IPeriodInfo) => {
        const { month, year } = period;
        this.setState((state) => {
            const settings = { ...state.settings, month, year };
            return { settings };
        });
    };

    /**
     * Получение сообщений по периоду
     */
    private getMessages = () => {
        const messages = this.state.messages?.getMessagesByPeriod(
            this.state.settings.year,
            this.state.settings.month
        );

        const { settings } = this.state;
        const query = settings.query?.toLowerCase();

        return messages.filter(msg => {
            // Требуются только с аттачами, но в сообщении нет аттачей
            if (settings.showOnly === TMessageViewFilter.WITH_ATTACHMENTS && (!msg.attachments || !msg.attachments.length)) {
                return false;
            }

            // Есть запрос, но запрос не содержится в тексте
            // noinspection RedundantIfStatementJS
            if (settings.query && !msg.text.toLowerCase().includes(query)) {
                return false;
            }

            return true;
        }).reverse();
    };

    private onChangeOnlyWithAttachments = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        this.setState(state => {
            const settings = {
                ...state.settings,
                showOnly: checked
                    ? TMessageViewFilter.WITH_ATTACHMENTS
                    : TMessageViewFilter.ALL
            };
            return { settings };
        });
    };

    public override render() {
        const { error, stage, settings, messages } = this.state;

        if (error) {
            return (
                <div className="app app-page__error">
                    <div className="app-paper">
                        <h1>Произошла ошибка</h1>
                        <p>{error.message}</p>
                    </div>
                </div>
            );
        }

        switch (stage) {
            case AppStage.SELECT_FILE: {
                return (
                    <div className="app app-page__select">
                        <div className="app-paper">
                            <h1>APIdog Archive Viewer</h1>
                            <p>Выберите файл архива сообщений.</p>
                            <FileChooser
                                label="Выбрать JSON-файл"
                                onChoose={this.onFileChosen} />
                            <p className="app-footer">APIdog &copy; {YEAR_RELEASE}<br />v{APP_VERSION}</p>
                        </div>
                    </div>
                );
            }

            case AppStage.PARSING: {
                return (
                    <div className="app app-page__parsing">
                        <div className="app-paper">
                            <LoadSpinner />
                            <p>Пожалуйста, подождите...</p>
                        </div>
                    </div>
                );
            }

            case AppStage.VIEW: {
                return (
                    <div className="app-page__view viewer">
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
                    </div>
                );
            }

            default: {
                return (
                    <div className="app app-page__error">
                        <p>invalid stage</p>
                    </div>
                );
            }
        }
    }
}
