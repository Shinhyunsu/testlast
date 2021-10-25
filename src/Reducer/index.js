import { combineReducers } from 'redux';
import { coinReducer, coinSaga } from './coinReducer';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
    Coin: coinReducer
});

export function* rootSaga() {
    yield all([coinSaga()]);
}
export default rootReducer;