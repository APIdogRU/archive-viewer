import type { IArchiveComposite } from '@typings/IArchiveComposite';

export interface IArchiveSelectProps {
    setArchiveInfo: (composite: IArchiveComposite) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}
