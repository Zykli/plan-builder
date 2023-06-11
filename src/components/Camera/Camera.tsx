import React, { FC } from "react";
import { Item, PropsForComponents } from "../Item";
import { itemsSizes } from "../../utils/constanst";

const camera = <g>
    <g>
        <polygon points="1,.5 6,6 11,.5" stroke="#000" strokeWidth="1" fill="white" strokeLinejoin="round" />
    </g>
    <rect x=".5" y="3.5" width="11" height="15" stroke="#000" strokeWidth="1" fill="white" />
</g>;

export const Camera: FC<PropsForComponents & {
    id: string;
}> = ({
    ...props
}) => {
    return (
        <Item
            width={itemsSizes.camera.width}
            height={itemsSizes.camera.height}
            {...props}
            dragPointsBySmallSize
        >
            {camera}
        </Item>
    )
};