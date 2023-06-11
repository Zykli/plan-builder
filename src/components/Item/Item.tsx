import React, { FC, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { ItemProps } from './Item.index';
import { useAppContext, useDidUpdateEffect, useDragItem, useRotateItem } from "../../utils/hooks";
import './Item.css';
import { SizeContext } from "../../contexts/planSizes";
import { ItemsContext } from "../../contexts/items";
import { Rotate } from "../icons";
import { useDSItem } from "../../redux/dataStorage/hooks";
import { createPortal } from 'react-dom';

const getItemCenter = (x: number, y: number, width: number, height: number) => ({
    x: x + width / 2,
    y: y + height / 2
});

const renderCenter = (x: number, y: number, width: number, height: number, color?: string) => {
    return <rect x={x + width / 2 - 2} y={y + height / 2 - 2} width={4} height={4} rx={2} fill={color || "#f00"} />
};

const renderCenter2 = (x: number, y: number, width: number, height: number, color?: string) => {
    const item = <rect x={x + width / 2 - 2} y={y + height / 2 - 2} width={4} height={4} rx={2} fill={color || "#f00"} />
    const root = document.getElementById('centers');
    if(!root) return null;
    return createPortal(item, root);
};


export const Item: FC<ItemProps> = ({
    id,
    children,
    // x,
    // y,
    width,
    height,
    dragPointsBySmallSize,
    ...props
}) => {

    const {
        item,
        onChange
    } = useDSItem("items", id);

    const {
        x = 0,
        y = 0,
        rotate = 0
    } = item!;

    const [ _, setItems, itemsStateRef ] = useAppContext(ItemsContext);

    const {
        height: maxPositionY,
        width: maxPositionX
    } = useContext(SizeContext);

    const itemCenter = useMemo(() => getItemCenter(Number(x), Number(y), width, height), [x, y, width, height]);

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

    const smallestSize = useMemo(() => Math.min(width, height), []);

    const [
        coords,
        onMouseDown
    ] = useDragItem(x, y);

    useEffect(() => {
        let newX = coords.x;
        let newY = coords.y;
        let minX = 0 + width / 2;
        let maxX = maxPositionX - width / 2;
        let minY = 0 + height / 2;
        let maxY = maxPositionY - height / 2;
        if(dragPointsBySmallSize) {
            minX = smallestSize / 2;
            maxX = maxPositionX - smallestSize / 2;
            minY = smallestSize / 2;
            maxY = maxPositionY - smallestSize / 2;
        }
        newX = newX < minX
            ? minX
            : newX > maxX
            ? maxX
            : newX;
        newY = newY < minY
            ? minY
            : newY > maxY
            ? maxY
            : newY;
        // if(x !== newX || y !== newY) {
        onChange({
            x: newX,
            y: newY
        });
        // }
    }, [coords]);

    const itemRef = useRef<SVGSVGElement>(null);

    const [
        angle,
        onMouseRotateDown,
        rectCenter
    ] = useRotateItem(rotate, itemRef.current, true);

    useDidUpdateEffect(() => {
        onChange({
            rotate: angle
        });
    }, [angle]);

    const transform = useMemo(() => {
        return `rotate(${angle} ${nx + width / 2} ${ny + height / 2})`
    }, [nx, ny, width, height, angle]);
    
    if(!item) return null;

    return (
        <>
            <g
                className={'Item'}
                transform={transform}
                onMouseDown={(e) => {
                    onMouseDown(e);
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
                {renderCenter(nx, ny, width, height)}
            </g>
                {renderCenter2(rectCenter.x, rectCenter.y, width, height, "#00f")}
        </>
    );
};