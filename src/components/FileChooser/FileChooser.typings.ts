export type FileChooserCallback = (file: File) => void;

export interface IFileChooserProps {
    label: string;
    onFileSelected: FileChooserCallback;
}
