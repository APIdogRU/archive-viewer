import * as React from 'react';

import { LoadSpinner } from '@components/LoadSpinner/LoadSpinner';
import { Paper } from '@components/Paper/Paper';

export const AppLoading: React.FC = () => (
    <Paper title="APIdog Archive Viewer">
        <LoadSpinner />
        <p>Пожалуйста, подождите...</p>
    </Paper>
);
