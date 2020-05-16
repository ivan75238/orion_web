import {appActions} from "./actions";

const initial = {
    auth: false,
    user: null,
    headerText: "Маршруты"
};

export function app(state = initial, action) {

    switch (action.type) {
        case appActions.SET_AUTH_VALUE: {
            return {
                ...state,
                auth: action.auth
            };
        }

        case appActions.SET_AUTH_DATA: {
            return {
                ...state,
                user: action.user
            };
        }

        case appActions.SET_HEADER_TEXT: {
            return {
                ...state,
                headerText: action.text
            };
        }

        default:
            return state;
    }

}
