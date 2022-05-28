import * as React from 'react';

import { Paper } from '@components/Paper/Paper';

interface IAppErrorProps {
    error: string;
}

export const AppError: React.FC<IAppErrorProps> = ({ error }) => (
    <Paper
        title="Произошла ошибка"
        subtitle={error}
    />
);
