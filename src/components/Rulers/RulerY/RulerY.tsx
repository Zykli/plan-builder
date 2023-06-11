import React, { FC, ReactNode, SVGAttributes, useContext, useMemo } from "react";
import { RulerYProps } from "./RulerY.index";
import { ZoomContext } from "../../../contexts/zoom";
import { rulerSize, rulerLinesColor, rulerBackgroundColor, linesByMeter, pixelsInMeter, rulerMeterLinesHeight, rulerLinesHeight, rulerHalfMeterLinesHeight } from "../../../utils/constanst";

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

export const RulerY: FC<RulerYProps> = ({
    height,
    areaHeight
}) => {
    const zoom = useContext(ZoomContext);

    const width = useMemo(() => rulerSize / zoom.a, [zoom.a]);
    const x = useMemo(() => - (zoom.e / zoom.a), [zoom.e, zoom.a]);
    const y = useMemo(() => - (zoom.f / zoom.a), [zoom.f, zoom.a]);

    const ay = useMemo(() => 0 - zoom.f / zoom.a, [zoom.f,  zoom.a]);
    const ah = useMemo(() => areaHeight / zoom.a, [areaHeight, zoom.a]);
    const rulerOffset = useMemo(() => .5, []);

    const lines = useMemo(() => {
        const lines = getLines(height);
        if(!lines) return null;
        const fullMeterLines: ReactNode[] = [
            <Line
                key={`v-0`}
                id={`v-0`}
                x1={0}
                y1={rulerOffset}
                x2={rulerMeterLinesHeight / zoom.a}
                y2={rulerOffset}
                stroke={'#000'}
            />
        ];
        const othersLines: ReactNode[] = [];
        new Array(lines.count).fill(null).forEach((el, idx) => {
            const y = lines.step * idx + lines.step;
            const isFullMeter = lineAtMeter(idx);
            const isHalfMeter = lineAtHalfMeter(idx);
            const width = isHalfMeter ? rulerHalfMeterLinesHeight : isFullMeter ? rulerMeterLinesHeight : rulerLinesHeight;
            const node = <Line
                key={`v-${idx + 1}`}
                id={`v-${idx + 1}`}
                x1={0}
                y1={y + rulerOffset}
                x2={width / zoom.a}
                y2={y + rulerOffset}
                stroke={isFullMeter ? '#000' : undefined}
            />;
            if(isFullMeter) {
                fullMeterLines.push(node);
            } else {
                othersLines.push(node);
            }
        });
        return {fullMeterLines, othersLines}
    }, [height, zoom.a]);

    return (
        <svg
            x={x}
            y={ay}
            width={width}
            height={ah}
        >
            <rect
                x={0}
                y={0}
                width={width}
                height={ah}
                fill={"#fff"}
            />
            <svg
                x={0}
                y={-y - rulerOffset}
                width={width}
                height={height + rulerOffset * 2}
            >
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height + rulerOffset * 2}
                    fill={rulerBackgroundColor}
                />
                {lines?.othersLines}
                {lines?.fullMeterLines}
            </svg>
            <rect
                x={0}
                y={0}
                width={width}
                height={width}
                fill={"#fff"}
            />
        </svg>
    );
};