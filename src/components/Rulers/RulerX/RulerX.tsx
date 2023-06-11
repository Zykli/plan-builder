import React, { FC, ReactNode, SVGAttributes, useContext, useEffect, useMemo } from "react";
import { RulerXProps } from "./RulerX.index";
import { ZoomContext } from "../../../contexts/zoom";
import { linesByMeter, pixelsInMeter, rulerSize, rulerLinesColor, rulerBackgroundColor, rulerMeterLinesHeight, rulerLinesHeight, rulerHalfMeterLinesHeight } from "../../../utils/constanst";

const getLines = (value: number) => {
    const sizeByMeters = value / pixelsInMeter;
    const count = Math.ceil(sizeByMeters * linesByMeter);
    // const count = Math.ceil(sizeByMeters * 100 / lineEverySM) - 1;
    if(count <= 0) return null;
    const lineEverySM = 100 / linesByMeter;
    const step = pixelsInMeter / (100 / lineEverySM);
    return {
        count,
        step
    };
};

const Line: FC<SVGAttributes<SVGLineElement>> = ({
    stroke = rulerLinesColor,
    ...props
}) => {
    return (
        <line
            stroke={stroke}
            strokeWidth={1}
            {...props}
        />
    );
};

const lineAtMeter = (lineNumber: number) => (lineNumber + 1) % linesByMeter === 0;
const lineAtHalfMeter = (lineNumber: number) => (lineNumber + 1) % linesByMeter === linesByMeter / 2;

export const RulerX: FC<RulerXProps> = ({
    width,
    areaWidth
}) => {
    const zoom = useContext(ZoomContext);

    const height = useMemo(() => rulerSize / zoom.a, [zoom.a]);
    const x = useMemo(() => - (zoom.e / zoom.a), [zoom.e, zoom.a]);
    const y = useMemo(() => - (zoom.f / zoom.a), [zoom.f, zoom.a]);

    const ax = useMemo(() => 0 - zoom.e / zoom.a, [zoom.e,  zoom.a]);
    const aw = useMemo(() => areaWidth / zoom.a, [areaWidth, zoom.a]);
    const rulerOffset = useMemo(() => .5, []);

    const lines = useMemo(() => {
        const lines = getLines(width);
        if(!lines) return null;
        const fullMeterLines: ReactNode[] = [
            <Line
                key={`v-0`}
                id={`v-0`}
                x1={rulerOffset}
                y1={0}
                x2={rulerOffset}
                y2={rulerMeterLinesHeight / zoom.a}
                stroke={'#000'}
            />
        ];
        const othersLines: ReactNode[] = [];
        new Array(lines.count).fill(null).forEach((el, idx) => {
            const x = lines.step * idx + lines.step;
            const isFullMeter = lineAtMeter(idx);
            const isHalfMeter = lineAtHalfMeter(idx);
            const height = isHalfMeter ? rulerHalfMeterLinesHeight : isFullMeter ? rulerMeterLinesHeight : rulerLinesHeight;;
            const node = <Line
                key={`v-${idx + 1}`}
                id={`v-${idx + 1}`}
                x1={x + rulerOffset}
                y1={0}
                x2={x + rulerOffset}
                y2={height / zoom.a}
                stroke={isFullMeter ? '#000' : undefined}
            />;
            if(isFullMeter) {
                fullMeterLines.push(node);
            } else {
                othersLines.push(node);
            }
        });
        return {fullMeterLines, othersLines}
    }, [width, zoom.a]);

    return (
        <svg
            x={ax}
            y={y}
            width={aw}
            height={height}
        >
            <rect
                x={0}
                y={0}
                width={aw}
                height={height}
                fill={"#fff"}
            />
            <svg
                x={- x - rulerOffset}
                y={0}
                width={width + rulerOffset * 2}
                height={height}
            >
                <rect
                    x={0}
                    y={0}
                    width={width + rulerOffset * 2}
                    height={height}
                    fill={rulerBackgroundColor}
                />
                {lines?.othersLines}
                {lines?.fullMeterLines}
            </svg>
            <rect
                x={0}
                y={0}
                width={height}
                height={height}
                fill={"#fff"}
            />
        </svg>
    );
};