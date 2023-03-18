
export function forEachEnum(enumObj: Record<string & number, string>, fn: (str: string) => any) {
    const enumArr = Object.values(enumObj) as Array<string & number>;
    for (let i = 0; i < enumArr.length / 2; i++) {
        fn(enumArr[i]);
    }
}

export function mapEnum<T>(enumObj: Record<string & number, string>, fn: (str: string) => T) : T[]{
    const enumArr = Object.values(enumObj) as Array<string & number>;
    const result = [];
    for (let i = 0; i < enumArr.length / 2; i++) {
        result.push(fn(enumArr[i]));
    }
    return result;
}

export function enumToArray(enumObj: Record<string & number, string>) {
    return mapEnum(enumObj, str => str);
}

export function convertBooleanStrings(obj: Record<string, string>) {
    const result: Record<string, string | boolean> = {};
    for (const key in obj) {
        result[key] = convertBooleanString(obj[key]);
    }
    return result;
}

function convertBooleanString(value: string) {
    switch (value.toLowerCase()) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return value;
    }
}