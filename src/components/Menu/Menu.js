import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {IconHumburger} from "components/Icons";
import Button from "components/Elements/Button";
import Orders from "components/Icons/Orders";
import {Link} from "react-router-dom";
import Calendar from "components/Icons/Calendar";
import Sale from "components/Icons/Sale";
import Peoples from "components/Icons/Peoples";
import Car from "components/Icons/Car";
import Price from "components/Icons/Price";
import Rout from "components/Icons/Rout";
import Ticket from "components/Icons/Ticket";
import WorkPlan from "components/Icons/WorkPlan";
import Report from "components/Icons/Report";
import Settings from "components/Icons/Settings";
import News from "components/Icons/News";
import {Paths} from "../../Paths";

const Title = styled.p`
    text-transform: uppercase;
    font-size: 32px;
    line-height: 32px;
    font-weight: 400;
    margin-left: 16px;
    transition: all 0.1s ease;
    opacity: ${props => props.isOpen ? "1" : "0"};
    color: #fff;
`;

const MainWrapper = styled.div`
    min-width: ${props => props.isOpen ? "260px" : "48px"};
    width: ${props => props.isOpen ? "260px" : "48px"};
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    background: #fff;
    transition: all 0.3s ease;
`;

const ToggleContainer = styled.div`
    width: 100%;
    height: 60px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #00b700;
    padding: 0 8px;
    cursor: pointer;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: ${props => props.isOpen ? "16px" : "8px"};
    border-bottom: 1px solid #cdcdcd;
`;

const ItemsContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: ${props => props.isOpen ? "16px" : "0"};
    overflow-y: auto;
`;

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const ItemText = styled.p`
    margin: 0 0 0 16px;
    font-size: 16px;
    color: #232735;
    
    &:hover {
        color: #00b700;  
    }
`;

const LinkStyled = styled(Link)`
    text-decoration: none;
    width: 100%;
    padding: ${props => props.isOpen ? "8px" : "8px"};
    box-sizing: border-box;
    
     ${props => props.isActive ? "border-left: 4px solid #00b700" : ""}
    
    ${
        props => !props.isOpen &&
        `
            &:hover {            
                svg {
                    border: 1px solid #cdcdcd;
                    border-radius: 3px;
                }
            }
        `
    }
`;

const MenuItems = [
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
        link: Paths.car.list.path()
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
        title: "Отчеты",
        icon: Report,
        link: Paths.report.list.path()
    },
    {
        title: "Настройки",
        icon: Settings,
        link: Paths.setting.list.path()
    },
    {
        title: "Новости",
        icon: News,
        link: Paths.news.list.path()
    },
];

class Menu extends PureComponent {
    render() {
        const {isOpen, onChangeIsOpen} = this.props;
        return (
            <MainWrapper isOpen={isOpen}>
                <ToggleContainer>
                    <IconHumburger onClick={() => onChangeIsOpen(!isOpen)}/>
                    <Title isOpen={isOpen}>ORION</Title>
                </ToggleContainer>
                <Container isOpen={isOpen}>
                    <Button width="100%"
                            height={isOpen ? "48px" : "32px"}
                            title={isOpen ? "+ Создать" : "+"}/>
                </Container>
                <ItemsContainer isOpen={isOpen}>
                    {
                        MenuItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <LinkStyled to={item.link} key={i}
                                            isOpen={isOpen}>
                                    <ItemContainer>
                                        <Icon/>
                                        {
                                            isOpen &&
                                            <ItemText>{item.title}</ItemText>
                                        }
                                    </ItemContainer>
                                </LinkStyled>
                            )
                        })
                    }
                </ItemsContainer>
            </MainWrapper>
        )
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool,
    onChangeIsOpen: PropTypes.func
};

export default Menu;
