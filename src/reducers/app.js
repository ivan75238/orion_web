import {appActions} from "./actions";

const initial = {
    auth: false,
    user: null,
    headerText: "Заказы",
    routs: [],
    ticketTypes: [],
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

        case appActions.SET_ALL_ROUTS: {
            return {
                ...state,
                routs: action.routs
            };
        }

        case appActions.SET_TICKET_TYPES: {
            return {
                ...state,
                ticketTypes: action.ticketTypes
            };
        }

        case appActions.SET_ROUT_LOCATIONS: {
            const {routs} = state;
            const findedRout = routs.find(i => i.id === action.routid);
            findedRout.locations = action.locations;
            const otherRouts = routs.filter(i => i.id !== action.routid);
            return {
                ...state,
                routs: [...otherRouts, findedRout]
            };
        }

        default:
            return state;
    }

}
