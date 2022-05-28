import * as React from 'react';

import type { IArchiveComposite } from '@typings/IArchiveComposite';
import { FileChooser } from '@components/FileChooser/FileChooser';
import { Paper } from '@components/Paper/Paper';
import { readArchive } from '@utils/readArchive';
import { fetchAccountInformation } from '@utils/fetchAccountInformation';
import { buildArchiveIndexes } from '@utils/buildArchiveIndexes';

interface IArchiveSelectProps {
    setArchiveInfo: (composite: IArchiveComposite) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

const footer = `APIdog © 2022 [${process.env.APP_VERSION}]`;

export const ArchiveSelect: React.FC<IArchiveSelectProps> = ({ setArchiveInfo, setError, setLoading }) => {
    const onFileSelected = React.useCallback((file: File) => {
        setLoading(true);

        readArchive(file).then(archive => Promise.all([
            archive,
            buildArchiveIndexes(archive),
            fetchAccountInformation(archive),
        ])).then(([archive, index, accounts]) => {
            setArchiveInfo({ archive, index, accounts });
            setLoading(false);
        }).catch(error => {
            setError(`Ошибка:\n${error?.message}`);
            setLoading(false);
        });
    }, [setArchiveInfo, setError, setLoading]);

    return (
        <Paper
            title="APIdog Archive Viewer"
            subtitle="Выберите файл архива сообщений"
            footer={footer}
        >
            <FileChooser
                label="Выбрать JSON-файл"
                onFileSelected={onFileSelected}
            />
        </Paper>
    );
};
