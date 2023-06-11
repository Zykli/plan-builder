import { SVGAttributes } from "react";
import { Omit } from "../../utils/utils.types";

export type ItemProps = Omit<SVGAttributes<SVGSVGElement>, 'x' | 'y'> & {
    id: string;
    width: number;
    height: number;
    dragPointsBySmallSize?: boolean;
};

export type PropsForComponents = Omit<ItemProps, 'width' | 'height' | 'dragPointsBySmallSize'>;