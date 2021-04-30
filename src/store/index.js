import {createStore} from '../redux';
import rootReducer from "./reducers";
// 以后在创建仓库时不需要创建状态了
let store = createStore(rootReducer)
export default store