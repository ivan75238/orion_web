import axios from "axios";
import {apiUrl} from "config/config";
import moment from "moment";
import {sha512} from "js-sha512";

const API = {
    version: "2.0",

    order: {
        getAllOrders(date, id_marsh) {
            return axios.get(`${apiUrl}Order.GetAllOrders&date=${moment(date.toUTCString()).format("YYYY-MM-DD")}&id_marsh=${id_marsh}`)
        },
        getOrdersForOtchetPark(id_trip) {
            return axios.get(`${apiUrl}Order.GetOrdersForOtchetPark&id_trip=${id_trip}`)
        },
        async getOrderCount(date, param, type_method) {
            let response = {data:0};
            switch (type_method){
                case 0:
                    response = await axios.get(`${apiUrl}Order.GetOrderCountForGraphicZagr&id_marsh=${param}&date=${date.format("YYYY-MM-DD")}`);
                    break;
                case 1:
                    response = await axios.get(`${apiUrl}Order.GetOrderCountForGraphicTypeBilet&id_marsh=${param}&date=${date.format("YYYY-MM-DD")}`);
                    break;
                case 2:
                    response = await axios.get(`${apiUrl}Order.GetOrderCountForGraphicFromOrder&id_marsh=${param}&date=${date.format("YYYY-MM-DD")}`);
                    break;
            }
            return response.data;
        },
        getLastOrders() {
            return axios.get(`${apiUrl}Order.GetLastOrders`)
        }
    },

    price: {
        getPriceForMarsID(id_marsh) {
            return axios.get(`${apiUrl}Price.GetPriceForMarsID&id_marsh=${id_marsh}`)
        }
    },

    rout: {
        getAll() {
            return axios.get(`${apiUrl}Rout.GetAll`)
        },
        getLocality(id_rout) {
            return axios.get(`${apiUrl}Rout.GetLocality&id_rout=${id_rout}`)
        }
    },

    sms: {
        getBalance() {
            return axios.get(`${apiUrl}SMS.GetBalance`)
        }
    },

    park: {
        getCars(type) {
            return axios.get(`${apiUrl}Park.GetCars&type_get=${type}`)
        }
    },

    bilet: {
        get() {
            return axios.get(`${apiUrl}Bilet.Get`)
        }
    },

    client: {
        getAllClient() {
            return axios.get(`${apiUrl}Client.GetAllClient`)
        }
    },

    news: {
        get() {
            return axios.get(`${apiUrl}News.Get`)
        }
    },

    stock: {
        get() {
            return axios.get(`${apiUrl}Action.Get`)
        }
    },

    workPlan: {
        get() {
            return axios.get(`${apiUrl}WorkPlan.Get`)
        },
        getCountOrder(date_start, date_end) {
            return axios.get(`${apiUrl}WorkPlan.GetCountOrder&date_start=${date_start.format('YYYY-MM-DD')}&date_end=${date_end.format('YYYY-MM-DD')}`)
        }
    },

    trip: {
        getTripDate(date, id_rout, id_from, id_to) {
            return axios.get(`${apiUrl}Trip.GetTripDate&date=${moment(date.toUTCString()).format("YYYY-MM-DD")}&id_rout=${id_rout}&id_from=${id_from}&id_to=${id_to}`)
        },
        deleteTrip(id) {
            return axios.get(`${apiUrl}Trip.DeleteTrip&id=${id}`)
        },
        createTrip(date, id_marsh, id_car) {
            return axios.get(`${apiUrl}Trip.CreateTrip&date=${moment(date.toUTCString()).format("YYYY-MM-DD")}&id_marsh=${id_marsh}&id_car=${id_car}`)
        },
        getTripsForOtchetPark(id_car, date_nach, date_konec) {
            return axios.get(`${apiUrl}Trip.GetTripsForOtchetPark&id_car=${id_car}&date_nach=${moment(date_nach.toUTCString()).format("YYYY-MM-DD")}&date_konec=${moment(date_konec.toUTCString()).format("YYYY-MM-DD")}`)
        },

    },

    user: {
        loginV2(email, pass) {
            return axios.get(`${apiUrl}User.LoginV2&email=${email}&password=${sha512(pass)}`)
        },
        checkSession(uid) {
            return axios.get(`${apiUrl}User.CheckSession&uid=${uid}`)
        },
        updateSession(uid) {
            return axios.get(`${apiUrl}User.UpdateSession&uid=${uid}`)
        },
        logoutV2(uid) {
            return axios.get(`${apiUrl}User.LogoutV2&uid=${uid}`)
        },
        getUsers() {
            return axios.get(`${apiUrl}User.GetUsers`)
        },
    }
};

export {API}