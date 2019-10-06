import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class JsonUtils {
    constructor() { }
    getJsonString(object: any) {
        return JSON.stringify(object, (key, value) => {
            if (value instanceof Map) {
                return {
                    dataType: 'Map',
                    value: [...value]
                }
            } else {
                return value
            }
        })
    }

    parseJson(jsonString: any) {
        return JSON.parse(jsonString, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (value.dataType === 'Map') {
                    return new Map(value.value);
                }
            }
            return value;
        })
    }
}