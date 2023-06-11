import React, { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { SizerProps } from "./Sizer.index";
import './Sizer.css';
import { convertXYtoViewPort } from "../../utils/utils";
import { SizeContext } from "../../contexts/planSizes";
import { useDidUpdateEffect, useDragItem } from "../../utils/hooks";
import { ZoomContext } from "../../contexts/zoom";
import { pixelsInMeter } from "../../utils/constanst";

export const Sizer: FC<SizerProps> = ({
    height,
    width
}) => {

    const zoom = useContext(ZoomContext);

    const sizerStrokeWidth = useMemo(() => 4 / zoom.a, [zoom.a]);
    const sizerStrokeColor = useMemo(() => "#000", []);
    const strokeOffset = useMemo(() => sizerStrokeWidth / 2, [sizerStrokeWidth]);
    const linesEmptySize = useMemo(() => 0, [sizerStrokeWidth]);
    const dragType = useRef<'X' | 'Y' | 'XY' | null>(null);
    const angle = useMemo(() => {
        const widthSize = (sizerStrokeWidth + strokeOffset) * 1.5;
        const heightSize = (sizerStrokeWidth + strokeOffset) * 1.5;
        const svg = {
            x: width - widthSize,
            y: height - heightSize
        };
        const link = {
            x: 1,
            y: 1,
            height: heightSize * 2,
            width: widthSize * 2,
            rx: widthSize,
            ry: heightSize,
        }
        const rect = {
            x: 0,
            y: 0,
            height: heightSize,
            width: widthSize
        }
        return {
            svg,
            link,
            rect
        };
    }, [width, height, sizerStrokeWidth, strokeOffset, linesEmptySize]);

    const { setState: setSizes } = useContext(SizeContext);

    const [
        coords,
        onMouseDown
    ] = useDragItem(
        width - strokeOffset,
        height - strokeOffset
    );

    useDidUpdateEffect(() => {
        const width = coords.x < pixelsInMeter ? pixelsInMeter : coords.x;
        const height = coords.y < pixelsInMeter ? pixelsInMeter : coords.y;
        switch(dragType.current) {
            case 'X': {
                setSizes({
                    width
                });
                break;
            }
            case 'Y': {
                setSizes({
                    height
                });
                break;
            }
            case 'XY': {
                setSizes({
                    width,
                    height
                });
                break;
            }
        }
    }, [coords]);

    return (
        <g>
            <defs>
                <clipPath id="angle">
                    <rect 
                        {...angle.link}
                    />
                </clipPath>
            </defs>
            <line
                onMouseDown={(e) => {
                    dragType.current = 'X';
                    onMouseDown(e);
                }}
                onMouseUp={() => {
                    dragType.current = null;
                }}
                className={'SizerX'}
                x1={width - strokeOffset}
                x2={width - strokeOffset}
                y1={0}
                y2={height - sizerStrokeWidth - linesEmptySize}
                stroke={sizerStrokeColor}
                strokeWidth={sizerStrokeWidth}
            />
            <line
                onMouseDown={(e) => {
                    dragType.current = 'Y';
                    onMouseDown(e);
                }}
                onMouseUp={() => {
                    dragType.current = null;
                }}
                className={'SizerY'}
                x1={0}
                x2={width - sizerStrokeWidth - linesEmptySize}
                y1={height - strokeOffset}
                y2={height - strokeOffset}
                stroke={sizerStrokeColor}
                strokeWidth={sizerStrokeWidth}
            />
            <svg
                {...angle.svg}
            >
                <rect
                    className={'SizerXY'}
                    onMouseDown={(e) => {
                        dragType.current = 'XY';
                        onMouseDown(e);
                    }}
                    onMouseUp={() => {
                        dragType.current = null;
                    }}
                    clipPath={"url(#angle)"}
                    fill={"#000"}
                    {...angle.rect}
                />
            </svg>
        </g>
    )
};  