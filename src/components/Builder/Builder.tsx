import React, { ComponentProps, FC, useCallback, useEffect, useRef, useState } from "react";
import { BuilderProps } from "./Builder.index";
import { Svg } from "../Svg";
import { Value, ReactSVGPanZoom } from 'react-svg-pan-zoom';
import { useEditedContext, useRefResize } from "../../utils/hooks";
import { Menu } from "../Menu";
import { viewHeight as initialViewHeight, rulerSize } from "../../utils/constanst";
import { ZoomContext, initialZoom } from "../../contexts/zoom";
import './Builder.css';
import { Sizer } from "../Sizer";
import { SizeContext, initialSizes,  } from "../../contexts/planSizes";
import { EditContext, initialEdit } from "../../contexts/editSize";
import { Grid } from "../Grid";
import { RulerX } from "../Rulers/RulerX";
import { RulerY } from "../Rulers/RulerY";
import { addHandler, removeHandler } from "../../utils/signals";
import { ItemsContext, initialItems } from "../../contexts/items";

export const Builder: FC<BuilderProps> = () => {

    const rootDivRef = useRef<HTMLDivElement>(null);

    const [ sizes, setSizes ] = useEditedContext(initialSizes, SizeContext);
    const [ editState, setEdit ] = useEditedContext(initialEdit, EditContext);

    const [ viewWidth, viewHeight ] = useRefResize(rootDivRef.current, { initialWidth: 800, initialHeight: initialViewHeight });

    const [ value, setValue ] = useState<Value>(initialZoom);
    const Viewer = useRef<ReactSVGPanZoom>(null);
    
    useEffect(() => {
        const handler = () => {
            if(!rootDivRef.current) return ;
            Viewer.current?.fitToViewer();
        };
        addHandler('fitToViewer', handler);
        return () => {
            removeHandler('fitToViewer', handler);
        };
    }, []);

    useEffect(() => {
        if(!rootDivRef.current) return ;
        Viewer.current?.setValue({
            ...Viewer.current?.getValue(),
            e: rulerSize,
            f: rulerSize
        });
    }, []);

    return (
        <div
            ref={rootDivRef}
            className={'PlanBuilder'}
        >
            <SizeContext.Provider value={{
                width: sizes.width,
                height: sizes.height,
                setState: setSizes
            }}>
            <ZoomContext.Provider value={value}>
            <EditContext.Provider value={{
                ...editState,
                setState: setEdit
            }}>
                <Menu
                    rootRef={rootDivRef.current}
                />
                <ReactSVGPanZoom
                    ref={Viewer}
                    height={viewHeight}
                    width={viewWidth}
                    tool={'auto'}
                    onChangeTool={() => {}}
                    value={value}
                    onChangeValue={(val) => setValue(val)}
                    // onZoom={e => console.log('zoom')}
                    // onPan={e => console.log('pan')}
                    // onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                    detectAutoPan={false}
                    disableDoubleClickZoomWithToolAuto={true}
                    customToolbar={() => <></>}
                    customMiniature={() => <></>}
                    // background="transparent"
                    SVGBackground="transparent"
                >
                    <svg width={sizes.width} height={sizes.height} viewBox={`0 0 ${sizes.width} ${sizes.height}`} >
                        <g id={"viewport"}>
                            <rect
                                x={0}
                                y={0}
                                width={sizes.width}
                                height={sizes.height}
                                fill="#fff"
                            />
                            <Grid
                                width={sizes.width}
                                height={sizes.height}
                            />
                            <Svg />
                            {
                                editState.edit &&
                                <Sizer
                                    width={sizes.width}
                                    height={sizes.height}
                                />
                            }
                            <RulerX
                                width={sizes.width}
                                areaWidth={viewWidth}
                            />
                            <RulerY
                                height={sizes.height}
                                areaHeight={viewHeight}
                            />
                        </g>
                    </svg>
                </ReactSVGPanZoom>
            </EditContext.Provider>
            </ZoomContext.Provider>
            </SizeContext.Provider>
        </div>
    );
};