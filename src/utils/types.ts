export type ContextWithSetState<S extends {[key: string]: any}> = S & {
    setState: (value: Partial<S>) => void;
};

type ItemTypes = 'Camera' | 'Table' | 'Wall';

export type Item<Type extends ItemTypes = ItemTypes> = {
    id: string;
    name: string;
    type: Type;
    x: number;
    y: number;
    rotate: number;
};