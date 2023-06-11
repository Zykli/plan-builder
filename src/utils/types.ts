export type ContextWithSetState<S extends {[key: string]: any}> = S & {
    setState: (value: Partial<S>) => void;
};

export type Item = {
    id: string;
    name: string;
    type: 'Camera' | 'Table';
    x: number;
    y: number;
    rotate: number;
};