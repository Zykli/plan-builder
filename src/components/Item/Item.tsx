import React, { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { ItemProps } from './Item.index';
import { useAppContext, useDidUpdateEffect, useDragItem, useRotateItem } from "../../utils/hooks";
import './Item.css';
import { SizeContext } from "../../contexts/planSizes";
import { ItemsContext } from "../../contexts/items";
import { Rotate } from "../icons";
import { useDSItem } from "../../redux/dataStorage/hooks";
import { createPortal } from 'react-dom';
import { useSelectedItem } from "../../redux/itemsState/hooks";

const getItemCenter = (x: number, y: number, width: number, height: number) => ({
    x: x + width / 2,
    y: y + height / 2
});

const renderCenter = (x: number, y: number, width: number, height: number, color?: string) => {
    return <rect x={x + width / 2 - 2} y={y + height / 2 - 2} width={4} height={4} rx={2} fill={color || "#f00"} />
};

export const Item: FC<ItemProps> = ({
    id,
    children,
    width,
    height,
    dragPointsBySmallSize,
    ...props
}) => {

    const {
        item,
        onChange
    } = useDSItem("items", id);

    const selectedState = useSelectedItem();
    const disableSelect = useRef(false);

    const {
        x = 0,
        y = 0,
        rotate = 0
    } = item!;

    const nx = useMemo(() => {
        const nx = Number(x);
        if(isNaN(nx)) return 0;
        return nx - width / 2;
    }, [x]);

    const ny = useMemo(() => {
        const ny = Number(y);
        if(isNaN(ny)) return 0;
        return ny - height / 2;
    }, [y]);

    const itemRef = useRef<SVGSVGElement>(null);

    const [
        coords,
        onMouseDown,
    ] = useDragItem(
        x,
        y,
        itemRef.current,
        dragPointsBySmallSize
    );

    useDidUpdateEffect(() => {
        disableSelect.current = true;
        onChange({
            x: coords.x,
            y: coords.y
        });
    }, [coords]);

    const [
        angle,
        onMouseRotateDown
    ] = useRotateItem(rotate, itemRef.current, true);

    useDidUpdateEffect(() => {
        disableSelect.current = true;
        onChange({
            rotate: angle
        });
    }, [angle]);

    const transform = useMemo(() => {
        return `rotate(${angle} ${nx + width / 2} ${ny + height / 2})`
    }, [nx, ny, width, height, angle]);

    const isSelected = useMemo(() => {
        return selectedState.selected === id;
    }, [selectedState.selected, id]);
    
    if(!item) return null;

    return (
        <g
            className={'Item'}
            transform={transform}
            onMouseDown={(e) => {
                onMouseDown(e);
            }}
            onClick={() => {
                if(!disableSelect.current) {
                    selectedState.setSelected(isSelected ? null : id )
                } else {
                    disableSelect.current = false;
                }
            }}
        >
            <svg
                ref={itemRef}
                x={nx}
                y={ny}
                width={width}
                height={height}
                {...props}
            >
                {children}
            </svg>
            {
                isSelected &&
                <g
                    className="rotate"
                    onMouseDown={(e) => {
                        onMouseRotateDown(e);
                    }}
                    transform={`rotate(45 ${nx + 5 + ((width - 10) / 2)} ${ny + height + 5})`}
                >
                    <svg
                        x={nx + ((width - 10) / 2)}
                        y={ny + height}
                        width={10}
                        height={10}
                    >
                        <polygon
                            points=".25,9.75 .25,5 5,.25 9.75,.25 9.75,5 5,9.75"
                            stroke="#000"
                            strokeWidth=".5"
                            fill="#fff" 
                            strokeLinejoin="round"
                        />
                    </svg>
                    <Rotate
                        className="svg-disable-focus"
                        x={nx + ((width - 10) / 2)}
                        y={ny + height}
                        width={10}
                        height={10}
                    />
                </g>
            }
        </g>
    );
};