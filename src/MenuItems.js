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
        adminRights: false,
        link: Paths.order.list.path()
    },
    {
        title: "Рассписание",
        icon: Calendar,
        adminRights: false,
        link: Paths.schedule.list.path()
    },
    {
        title: "Клиенты",
        icon: Peoples,
        adminRights: false,
        link: Paths.client.list.path()
    },
    {
        title: "Акции",
        icon: Sale,
        adminRights: false,
        link: Paths.sale.list.path()
    },
    {
        title: "Автопарк",
        icon: Car,
        adminRights: true,
        link: Paths.carPark.list.path()
    },
    {
        title: "Прейскурант",
        icon: Price,
        adminRights: true,
        link: Paths.price.list.path()
    },
    {
        title: "Маршруты",
        icon: Rout,
        adminRights: false,
        link: Paths.rout.list.path()
    },
    {
        title: "Типы билетов",
        icon: Ticket,
        adminRights: true,
        link: Paths.ticket.list.path()
    },
    {
        title: "План работы",
        icon: WorkPlan,
        adminRights: true,
        link: Paths.workplan.list.path()
    },
    {
        title: "Настройки",
        icon: Settings,
        adminRights: true,
        link: Paths.setting.list.path()
    },
    {
        title: "Отчеты",
        icon: Report,
        adminRights: true,
        link: Paths.report.list.path()
    },
    {
        title: "Управление СМС",
        icon: Sms,
        adminRights: true,
        link: Paths.sms.list.path()
    },
    {
        title: "Новости",
        icon: News,
        adminRights: true,
        link: Paths.news.list.path()
    },
];
