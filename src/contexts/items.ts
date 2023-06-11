import { createContext } from "react";
import { viewHeight } from "../utils/constanst";
import { ContextWithSetState, Item } from "../utils/types";

type Items = {
    items: {
        [key: Item['id']]: Item;
    };
}

export const initialItems: Items = {
    items: {
        // ["1"]: {
        //     id: '1',
        //     name: 'Camera 1',
        //     type: 'Camera',
        //     x: 50,
        //     y: 50,
        //     rotate:0
        // },
        ["2"]: {
            id: '2',
            name: 'Table 1',
            type: 'Table',
            x: 0,
            y: 0,
            rotate:0
        }
    }
};

export const ItemsContext = createContext<ContextWithSetState<Items>>({
    ...initialItems,
    setState: () => {}
});