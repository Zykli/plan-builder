import { useCallback, useEffect, useState } from "react";

const params = []

export const useQuery = <Value, Method extends () => Promise<Value>> (
    method: Method,
    dataExtractor: (value: Value) => Value,
    deps: any[] = [],
) => {

    const [ rezult, setResult ] = useState<Value | null>(null);

    const getData = useCallback(async function() {
        const data = await method();
        setResult(data);
    }, deps);

    useEffect(() => {
        getData();
    }, [getData]);

    return [ rezult ] as const;
};