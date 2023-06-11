
declare global {
  
    interface ObjectConstructor {
        typedKeys<T>(obj: T): Array<keyof T>
    }
}

Object.typedKeys = Object.keys;

export {};