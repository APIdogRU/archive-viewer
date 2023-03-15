export interface ICheckboxProps {
    name: string;
    label: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
}
