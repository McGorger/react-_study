import { combineReducers } from '../../redux';
import counter1  from './couter1'
import counter2  from './couter2'
let reducers = {
    counter1,
    counter2
}
let rootReducer = combineReducers(reducers)
export default rootReducer