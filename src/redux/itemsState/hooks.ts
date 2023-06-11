import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../hooks";
import { getItemsStateField } from "./selectors";
import { changeState } from "./actions";
import { useCallback, useState } from "react";

export const useSelectedItem = () => {
    const dispatch = useDispatch();

    const selected = useAppSelector(getItemsStateField('selected'));

    const setSelected = useCallback((value: typeof selected) => {
        dispatch(
            changeState({
                variable: 'selected',
                value
            })
        );
    }, []);

    return {
        selected,
        setSelected
    }
};