export interface IArchiveMeta {
    v: string;
    peer: number;
    ownerId: number;
    owner?: {
        firstName: string;
        lastName: string;
    };
    d: number;
}
