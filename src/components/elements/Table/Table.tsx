import React, { FC } from "react";
import { Item, PropsForComponents } from "../../Item";
import { itemsStrokeWidth } from "../../../utils/constanst";

const table = <rect
    x={.5}
    y={.5}
    width={99}
    height={49}
    fill="#fff"
    stroke={'#000'}
    strokeWidth={itemsStrokeWidth}
    rx={2.5}
/>

export const Table: FC<PropsForComponents & {
    id: string;
}> = ({
    ...props
}) => {
    return (
        <Item
            width={100}
            height={50}
            {...props}
        >
            {table}
        </Item>
    )
};