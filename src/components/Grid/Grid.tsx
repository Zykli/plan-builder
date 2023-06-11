import React, { FC, ReactNode, SVGAttributes, useMemo, useRef } from "react";
import { GridProps } from "./Grid.index";
import { pixelsInMeter, linesByMeter } from "../../utils/constanst";

// const lineColor = '#c1c1c1';
// const fullMeterLineColor = '#7c7c7c';
const lineColor = '#cdcdcd';
const fullMeterLineColor = '#898989';


const getLines = (value: number) => {
    const sizeByMeters = value / pixelsInMeter;
    const count = Math.ceil(sizeByMeters * linesByMeter) - 1;
    // const count = Math.ceil(sizeByMeters * 100 / lineEverySM) - 1;
    if(count <= 0) return null;
    const lineEverySM = 100 / linesByMeter;
    const step = pixelsInMeter / (100 / lineEverySM);
    return {
        count,
        step
    };
};

const lineAtMeter = (lineNumber: number) => (lineNumber + 1) % linesByMeter === 0;

const Line: FC<SVGAttributes<SVGLineElement>> = ({
    stroke = lineColor,
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

export const Grid: FC<GridProps> = ({
    height,
    width
}) => {

    const horizontalLines = useMemo(() => {
        const lines = getLines(height);
        if(!lines) return null;
        const fullMeterLines: ReactNode[] = [];
        const othersLines: ReactNode[] = [];
        new Array(lines.count).fill(null).forEach((el, idx) => {
            const y = lines.step * idx + lines.step;
            const isFullMeter = lineAtMeter(idx);
            const node = <Line
                key={`h-${idx}`}
                id={`h-${idx}`}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke={isFullMeter ? fullMeterLineColor : undefined}
            />;
            if(isFullMeter) {
                fullMeterLines.push(node);
            } else {
                othersLines.push(node);
            }
        });
        return {
            fullMeterLines,
            othersLines
        };
    }, [height, width]);

    const verticalLines = useMemo(() => {
        const lines = getLines(width);
        if(!lines) return null;
        const fullMeterLines: ReactNode[] = [];
        const othersLines: ReactNode[] = [];
        new Array(lines.count).fill(null).forEach((el, idx) => {
            const x = lines.step * idx + lines.step;
            const isFullMeter = lineAtMeter(idx);
            const node = <Line
                key={`v-${idx}`}
                id={`v-${idx}`}
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke={lineAtMeter(idx) ? fullMeterLineColor : undefined}
            />;
            if(isFullMeter) {
                fullMeterLines.push(node);
            } else {
                othersLines.push(node);
            }
        });
        return {
            fullMeterLines,
            othersLines
        };
    }, [width, height]);
    
    return (
        <svg
            x={0}
            y={0}
            width={width}
            height={height}
        >
            {horizontalLines?.othersLines}
            {verticalLines?.othersLines}
            {horizontalLines?.fullMeterLines}
            {verticalLines?.fullMeterLines}
        </svg>
    );
};