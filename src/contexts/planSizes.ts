import { createContext } from "react";
import { defaultAreaInMeters, pixelsInMeter, viewHeight } from "../utils/constanst";
import { ContextWithSetState } from "../utils/types";

type Sizes = {
    width: number;
    height: number;
};

export const initialSizes: Sizes = {
    width: defaultAreaInMeters.width * pixelsInMeter,
    height: defaultAreaInMeters.height * pixelsInMeter
};

export const SizeContext = createContext<ContextWithSetState<Sizes>>({
    ...initialSizes,
    setState: () => {}
});