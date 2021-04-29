import {React_TEXT} from './constant'
export function wrapToVdom(element) {
    return (typeof element === 'string' || typeof element === 'number') ? {type:React_TEXT}:element
}