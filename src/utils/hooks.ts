import { Context, DependencyList, useCallback, useContext, useEffect, useRef, useState } from "react";
import { convertXYtoViewPort } from "./utils";
import { ContextWithSetState } from "./types";
import { ZoomContext } from "../contexts/zoom";
import { SizeContext } from "../contexts/planSizes";
import { itemsStrokeWidth } from "./constanst";

/**
 * fn is call only when inputs change, not call on did mount
 * @param fn 
 * @param inputs 
 */
export function useDidUpdateEffect(fn: () => void, deps: DependencyList) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
    // eslint-disable-next-line
  }, deps);
};

type InitialOptions = {
  initialWidth?: number;
  initialHeight?: number;
};

/**
 * return sizes by ref element 
 * @param element - HTML element | null
 * @param param1 - initial options object like { initialWidth?: number; initialHeight?: number; }
 * @returns [ width, height ]
 */
export const useRefResize = (
  element: HTMLElement | null,
  {
    initialWidth,
    initialHeight
  }: InitialOptions
) => {

  const inFullScreenRef = useRef(false);

  const initialSizeRef = useRef({
    initialWidth,
    initialHeight
  });

  const [ sizes, setSizes ] = useState({
    width: initialWidth || document.body.clientWidth,
    heigth: initialHeight || document.body.clientHeight
  });
  const sizesRef = useRef(sizes);
  useEffect(() => {
    sizesRef.current = sizes;
  }, [sizes]);

  const onRezise = useCallback(() => {
    inFullScreenRef.current = document.fullscreenElement === element;
    const width = element?.clientWidth || document.body.clientWidth;
    const heigth = (!inFullScreenRef.current ? initialSizeRef.current.initialHeight : element?.clientHeight) || document.body.clientHeight;
    if(sizesRef.current.width !== width || sizesRef.current.heigth !== heigth) {
      setSizes({
        width,
        heigth
      });
    };
  }, [element]);

  useEffect(() => {
    onRezise();
    window.addEventListener('resize', onRezise);
    return () => {
      window.removeEventListener('resize', onRezise);
    };
  }, [onRezise]);

  return [sizes.width, sizes.heigth];
};

export const useDragItem = (
  startX: number,
  startY: number,
  item?: HTMLElement | SVGElement | null,
  dragBySmallestSize?: boolean,
  rootId?: string 
) => {

  const itemRef = useRef(item);
  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  const dragBySmallestSizeRef = useRef(dragBySmallestSize);
  useEffect(() => {
    dragBySmallestSizeRef.current = dragBySmallestSize;
  }, [dragBySmallestSize]);

  const zoomContext = useContext(ZoomContext);
  const zoomContextRef = useRef(zoomContext);
  useEffect(() => {
    zoomContextRef.current = zoomContext;
  }, [zoomContext]);

  const sizeContext = useContext(SizeContext);
  const sizeContextRef = useRef(sizeContext);
  useEffect(() => {
    sizeContextRef.current = sizeContext;
  }, [sizeContext]);

  const [newCoords, setNewCoords] = useState({
    x: startX,
    y: startY
  });

  const offsets = useRef([0, 0]);

  const onMouseMove = useCallback((e: MouseEvent) => {
      const [offsetX, offsetY] = offsets.current;
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      if(!itemRef.current) return ;
      const rect = itemRef.current.getBoundingClientRect();
      let smallestSize = 0;
      if(dragBySmallestSizeRef.current) {
        smallestSize = Math.min(rect.width, rect.height);
        rect.width = smallestSize;
        rect.height = smallestSize;
      }
      const zoomedRect: typeof rect = {
        ...rect,
        height: Math.round(rect.height / zoomContextRef.current.a) + itemsStrokeWidth,
        width: Math.round(rect.width / zoomContextRef.current.a) + itemsStrokeWidth
      };
      let minX = (zoomedRect.width / 2);
      let maxX = sizeContextRef.current.width - (zoomedRect.width / 2);
      let minY = (zoomedRect.height / 2);
      let maxY = sizeContextRef.current.height - (zoomedRect.height / 2);
      let coords = convertXYtoViewPort(mouseX, mouseY, rootId);
      if(!coords) return ;
      let newX = coords.x - offsetX;
      if(newX < minX) newX = minX;
      if(newX > maxX) newX = maxX;
      let newY = coords.y - offsetY;
      if(newY < minY) newY = minY;
      if(newY > maxY) newY = maxY;
      setNewCoords({
        x: newX,
        y: newY
      });
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      offsets.current = [0, 0];
  }, []);

  const onMouseDown = useCallback<React.MouseEventHandler<SVGElement>>((e) => {
      e.stopPropagation();
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      let initialDrag = convertXYtoViewPort(mouseX, mouseY);
      if(!initialDrag) return initialDrag;
      offsets.current = [
          initialDrag.x - startX,
          initialDrag.y - startY
      ];
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  }, [startX, startY, onMouseMove, onMouseUp]);

  return [
    newCoords,
    onMouseDown
  ] as const;
};

export const useRotateItem = (
  startDeg: number,
  itemRef: HTMLElement | SVGElement | null,
  backRotator?: boolean
) => {

  const [ newDeg, setNewDeg ] = useState(startDeg);

  const onMouseMove = useCallback((e: MouseEvent) => {
      if(!itemRef) return ;
      const rect = itemRef.getBoundingClientRect();
      const rectCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
      let angle = Math.atan2(e.pageX - rectCenter.x, - (e.pageY - rectCenter.y) )*(180 / Math.PI) + (backRotator ? 180 : 0); 
      angle = Math.round(angle * 100) / 100;
      if(e.ctrlKey) {
        const remainder = Math.round(angle % 10 * 100) / 100;
        // if(remainder )
        // console.log('remainder', remainder);
        if(remainder <= 2.5) {
          angle = angle - remainder;
        }
        else 
        if(remainder > 2.5 && remainder < 7.5) {
          angle = angle - remainder + 5;
        }
        else
        if(remainder >= 7.5) {
          angle = angle - remainder + 10;
        }
        console.log('angle', angle);
      }
      setNewDeg(angle);
  }, [itemRef]);

  const onMouseUp = useCallback((e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
  }, [itemRef]);

  const onMouseDown = useCallback<React.MouseEventHandler<SVGElement>>((e) => {
      e.stopPropagation();
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  }, [itemRef, onMouseMove, onMouseUp]);

  return [
    newDeg,
    onMouseDown
  ] as const;
};

export const useEditedContext = <IS extends {[key: string]: any}> (initialState: IS, Context: Context<ContextWithSetState<IS>>) => {
  const [ state, setS ] = useState(initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const setState = useCallback((newState: Partial<IS>) => {
    setS({
      ...stateRef.current,
      ...newState
    })
  }, []);

  return [
    state,
    setState
  ] as const;
};

export const useAppContext = <IS extends {[key: string]: any}> (Context: Context<ContextWithSetState<IS>>) => {
  const { setState, ...values } = useContext(Context);
  const setStateRef = useRef(values);
  useEffect(() => {
    setStateRef.current = values;
  }, [values]);
  return [ values, setState, setStateRef.current ] as const;
};