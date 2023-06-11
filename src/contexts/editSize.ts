import { createContext } from "react";
import { viewHeight } from "../utils/constanst";
import { ContextWithSetState } from "../utils/types";

type Edit = {
    edit: boolean;
}

export const initialEdit: Edit = {
    edit: false
};

export const EditContext = createContext<ContextWithSetState<Edit>>({
    ...initialEdit,
    setState: () => {}
});