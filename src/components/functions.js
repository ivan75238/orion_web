import axios from "axios";
import {apiUrl} from "config/config";

export const CheckStatus = status => {
    switch (status) {
        case "0":
            return "Оформлен";
        case "1":
            return "Забронирован";
        case "2":
            return "Оплачен полностью";
        case "3":
            return "Отменен";
    }
};

export const getCars = type => {
    return axios.get(`${apiUrl}Park.GetCars&type_get=${type}`)
        .then(response => {
            return response.data;
        })
};
