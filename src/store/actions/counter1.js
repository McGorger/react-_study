import * as types from "../action-types";
const actions = {
    add1(event,amount) { 
        return {type:types.ADD1}
    },
    minus1(event,amount) {
        return {type:types.MINUS1}
    }, //创建一个actionCreator的对象
    minus(event,amount) {
        return {type:types.MINUS}
    }
}
export default actions