export interface FormInput<T> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: keyof T;
    group?: number;
    type?: 'select' | 'text';
    options?: string[];
    label?: string;
}

export interface RoomData {
    room: string;
    newRoom: string;
}

export interface MessageData {
    username: string;
    message: string;
}

export interface FormButton {
    label: string;
    disabled?: boolean;
    visible?: boolean;
}

export interface Message {
    username: string;
    message: string;
}