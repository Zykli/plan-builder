import React, { FC, useContext, useEffect, useMemo } from "react";
import './Svg.css';
import { SvgProps } from "./Svg.index";
import { toPairs } from "lodash";
import { Item } from "../../utils/types";
import { useDSStorage, useDSStorageItemsByItemType } from "../../redux/dataStorage/hooks";
import { Table } from "../elements/Table";
import { Camera } from "../elements/Camera";
import { Wall } from "../elements/Wall";

const renderItem = (item: Item) => {
    switch (item.type) {
        case 'Camera': {
            return <Camera key={item.id} id={item.id} />;
        }
        case 'Table': {
            return <Table key={item.id} id={item.id} />;
        }
        case 'Wall': {
            return <Wall key={item.id} id={item.id} />;
        }
        default:
            break;
    }
    return null;
};

export const Svg: FC<SvgProps> = ({
}) => {
    
    const items = useDSStorage('items');

    const cameras = useDSStorageItemsByItemType('items', 'Camera');
    const tables = useDSStorageItemsByItemType('items', 'Table');
    const walls = useDSStorageItemsByItemType('items', 'Wall');

    // const cameras = useMemo(() => {
    //     return toPairs(items.storage).filter(([id, item]) => item?.type === 'Camera').map(([_, item]) => item);
    // }, [items.storage]);

    // const tables = useMemo(() => {
    //     return toPairs(items.storage).filter(([id, item]) => item?.type === 'Table').map(([_, item]) => item);
    // }, [items.storage]);

    // const walls = useMemo(() => {
    //     return toPairs(items.storage).filter(([id, item]) => item?.type === 'Wall').map(([_, item]) => item);
    // }, [items.storage]);

    return (
        <>
        {
            tables.map((item) => {
                if(!item) return null;
                return renderItem(item);
            })
        }
        {
            walls.map((item) => {
                if(!item) return null;
                return renderItem(item);
            })
        }
        {
            cameras.map((item) => {
                if(!item) return null;
                return renderItem(item);
            })
        }
        </>
    );
};