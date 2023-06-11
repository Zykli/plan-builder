import React, { FC, useContext, useEffect, useMemo } from "react";
import './Svg.css';
import { Camera } from "../Camera";
import { SvgProps } from "./Svg.index";
import { ItemsContext } from "../../contexts/items";
import { useAppContext } from "../../utils/hooks";
import { toPairs } from "lodash";
import { Item } from "../../utils/types";
import { Table } from "../Table";
import { useDSStorage } from "../../redux/dataStorage/hooks";

const renderItem = (item: Item) => {
    switch (item.type) {
        case 'Camera': {
            return <Camera key={item.id} id={item.id} />;
        }
        case 'Table': {
            return <Table key={item.id} id={item.id} />    
        }
        default:
            break;
    }
    return null;
};

export const Svg: FC<SvgProps> = ({
}) => {
    
    const items = useDSStorage('items');

    const cameras = useMemo(() => {
        return toPairs(items.storage).filter(([id, item]) => item?.type === 'Camera').map(([_, item]) => item);
    }, [items.storage]);

    const tables = useMemo(() => {
        return toPairs(items.storage).filter(([id, item]) => item?.type === 'Table').map(([_, item]) => item);
    }, [items.storage]);

    return (
        <>
            {
                tables.map((item) => {
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