import { ComponentProps, Context, useCallback, useContext, useEffect, useRef, useState } from "react";
import { convertXYtoViewPort } from "./utils";
import { ContextWithSetState } from "./types";

/**
 * fn is call only when inputs change, not call on did mount
 * @param fn 
 * @param inputs 
 */
export function useDidUpdateEffect(fn: () => void, inputs: any[]) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
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
    const heigth = (!inFullScreenRef.current ? initialHeight : element?.clientHeight) || document.body.clientHeight;
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
  rootId?: string 
) => {

  const [newCoords, setNewCoords] = useState({
    x: startX,
    y: startY
  });

  const offsets = useRef([0, 0]);

  const onMouseMove = useCallback((e: MouseEvent) => {
      const [offsetX, offsetY] = offsets.current;
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      let coords = convertXYtoViewPort(mouseX, mouseY, rootId);
      if(!coords) return ;
      let newX = coords.x - offsetX;
      let newY = coords.y - offsetY;
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
  const [ rectCenter, setrectCenter ] = useState({
    x: 0,
    y: 0
  });

  const onMouseMove = useCallback((e: MouseEvent) => {
      if(!itemRef) return ;
      const rect = itemRef.getBoundingClientRect();
      const rectCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.width / 2
      }
      setrectCenter(rectCenter)
      const angle = Math.atan2(e.pageX - rectCenter.x, - (e.pageY - rectCenter.y) )*(180 / Math.PI) + (backRotator ? 180 : 0); 
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
    onMouseDown,
    rectCenter
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