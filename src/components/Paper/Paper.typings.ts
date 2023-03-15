import type * as React from 'react';

export interface IPaperProps extends React.PropsWithChildren {
    title: string;
    subtitle?: string;
    footer?: string;
}
