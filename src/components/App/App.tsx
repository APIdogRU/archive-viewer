import * as React from 'react';

import { ArchiveViewer } from '@components/ArchiveViewer/ArchiveViewer';
import { ArchiveSelect } from '@components/ArchiveSelect/ArchiveSelect';
import type { IArchiveComposite } from '@typings/IArchiveComposite';

import { AppError } from './App.components/Error/AppError';
import { AppLoading } from './App.components/Loading/AppLoading';

export const App: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [archiveInfo, setArchiveInfo] = React.useState<IArchiveComposite | undefined>(undefined);

    if (error) return <AppError error={error} />;

    if (loading) return <AppLoading />;

    if (archiveInfo) return <ArchiveViewer {...archiveInfo} />;

    return (
        <ArchiveSelect
            setArchiveInfo={setArchiveInfo}
            setError={setError}
            setLoading={setLoading}
        />
    );
};
