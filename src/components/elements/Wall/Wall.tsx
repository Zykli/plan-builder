import React, { FC } from "react";
import { Item, PropsForComponents } from "../../Item";
import { itemsStrokeWidth } from "../../../utils/constanst";

const wall = <rect
    x={.5}
    y={.5}
    width={99}
    height={9}
    fill="#000"
    stroke={'#000'}
    strokeWidth={itemsStrokeWidth}
/>

export const Wall: FC<PropsForComponents & {
    id: string;
}> = ({
    ...props
}) => {
    return (
        <Item
            width={100}
            height={10}
            {...props}
        >
            {wall}
        </Item>
    )
};