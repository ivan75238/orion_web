import {combineReducers} from 'redux';
import { reducer as modal } from 'redux-modal';

import {app} from './app';

const rootReducer = combineReducers({
    modal,
    app,
});

export {rootReducer};
