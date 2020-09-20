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
