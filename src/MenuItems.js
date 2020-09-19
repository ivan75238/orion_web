import Orders from "components/Icons/Orders";
import {Paths} from "./Paths";
import Calendar from "components/Icons/Calendar";
import Peoples from "components/Icons/Peoples";
import Sale from "components/Icons/Sale";
import Car from "components/Icons/Car";
import Price from "components/Icons/Price";
import Rout from "components/Icons/Rout";
import Ticket from "components/Icons/Ticket";
import WorkPlan from "components/Icons/WorkPlan";
import Report from "components/Icons/Report";
import Settings from "components/Icons/Settings";
import News from "components/Icons/News";
import Sms from "components/Icons/Sms";


export const MenuItems = [
    {
        title: "Заказы",
        icon: Orders,
        link: Paths.order.list.path()
    },
    {
        title: "Рассписание",
        icon: Calendar,
        link: Paths.schedule.list.path()
    },
    {
        title: "Клиенты",
        icon: Peoples,
        link: Paths.client.list.path()
    },
    {
        title: "Акции",
        icon: Sale,
        link: Paths.sale.list.path()
    },
    {
        title: "Автопарк",
        icon: Car,
        link: Paths.carPark.list.path()
    },
    {
        title: "Прейскурант",
        icon: Price,
        link: Paths.price.list.path()
    },
    {
        title: "Маршруты",
        icon: Rout,
        link: Paths.rout.list.path()
    },
    {
        title: "Типы билетов",
        icon: Ticket,
        link: Paths.ticket.list.path()
    },
    {
        title: "План работы",
        icon: WorkPlan,
        link: Paths.workplan.list.path()
    },
    {
        title: "Настройки",
        icon: Settings,
        link: Paths.setting.list.path()
    },
    {
        title: "Отчеты",
        icon: Report,
        link: Paths.report.list.path()
    },
    {
        title: "Управление СМС",
        icon: Sms,
        link: Paths.sms.list.path()
    },
    {
        title: "Новости",
        icon: News,
        link: Paths.news.list.path()
    },
];
