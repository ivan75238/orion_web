import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import moment from "moment";
import ReactSelect from "components/Elements/ReactSelect";
import Checkbox from 'react-simple-checkbox';
import DropdownMenu from "components/Elements/DropdownMenu";
import {API} from "components/API";
import AccessRights from "components/Elements/AccessRights";
import ChangeLicensePopup from "components/Page/CarPark/ChangeLicensePopup";
import CreateCarParkPopup from "components/Page/CarPark/CreateCarParkPopup";

const ContentWrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #cdcdcd;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Filters = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const Body = styled.div`
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 238px);
    overflow-x: auto;
    position: relative;
`;

const Status = styled.div`
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    background: ${props => props.isActive ? "rgba(209, 205, 23, 0.5)" : "rgba(209, 23, 29, 0.5)"};    
    color: ${props => props.isActive ? "rgba(237, 186, 0, 1)" : "rgba(209, 23, 29, 1)"};    
    border: 1px solid ${props => props.isActive ? "rgba(209, 205, 23, 0.8)" : "rgba(209, 23, 29, 0.8)"};   
    border-radius: 5px; 
`;

const ActionContainer = styled.div`
    display: flex;
`;


@connect(state => ({
    routs: _get(state.app, "routs"),
    user: _get(state.app, "user")
}))
class CarParkPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            status: {value:0, label: "Все"},
            openPopupLicense: false,
            openPopupCreate: false,
        };
        this.load();
    }

    load = () => {
        API.park.getCars(this.state.status.value)
            .then(response => {
                const resp = response.data;
                this.setState({cars: resp});
            })
    };

    componentDidMount() {
        document.title = "Авто парк";
    }

    columns = [
        {
            name: "voditel",
            title: "Водитель",
            justifyContent: "flex-start",
            flex: "1 0 200px"
        },
        {
            name: "marka",
            title: "Марка",
            justifyContent: "flex-start",
            flex: "1 0 100px"
        },
        {
            name: "gos_nomer",
            title: "Гос. номер",
            justifyContent: "center",
            flex: "1 0 100px"
        },
        {
            name: "count_poezd",
            title: "Рейсы",
            justifyContent: "center",
            flex: "1 0 100px"
        },
        {
            name: "teh_obslyzh",
            title: "Тех. обслуживание",
            justifyContent: "center",
            flex: "1 0 120px"
        },
        {
            name: "arenda_nach",
            title: "Начало аренды",
            justifyContent: "center",
            flex: "1 0 140px"
        },
        {
            name: "arenda_konec",
            title: "Конец аренды",
            justifyContent: "center",
            flex: "1 0 140px"
        },
        {
            name: "status",
            title: "Статус",
            justifyContent: "center",
            flex: "1 0 140px"
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    onChangeType = value => {
        this.setState({status: value}, () => this.load())
    };

    convertStatus = status => {
        switch (status) {
            case "0":
                return "Активный";
            case "1":
                return "Неактивный";
        }
    };

    changeTechObsluzh = async (id_car, value) => {
        await API.park.changeTechObsluzh(id_car, value);
        this.load();
    };

    render() {
        let {cars, status, openPopupLicense, openPopupCreate} = this.state;
        const {user} = this.props;

        if (user.role === "0")
            return <AccessRights/>;

        cars = cars.filter(i => i.id !== "0").map((i, j) => {
            return {
                ...i,
                arenda_nach: moment(i.arenda_nach, "YYYY-MM-DD").format("DD.MM.YYYY"),
                arenda_konec: moment(i.arenda_konec, "YYYY-MM-DD").format("DD.MM.YYYY"),
                status: <Status isActive={i.status === "0"}>{this.convertStatus(i.status)}</Status>,
                teh_obslyzh: <Checkbox checked={i.teh_obslyzh === "1"}/>,
                actions: <ActionContainer>
                    <DropdownMenu items={[
                                    {
                                        title: "Редактировать",
                                        onClick: () => this.setState({openPopupCreate: i})
                                    },
                                    {
                                        title: "Уволить",
                                        onClick: async () => {
                                            await API.park.del(i.id);
                                            await this.load();
                                        }
                                    },
                                    {
                                        title: "Продлить аренду",
                                        onClick: () => this.setState({openPopupLicense: i})
                                    },
                                    {
                                        title: "Изменить тех. обслуживание",
                                        onClick: () => this.changeTechObsluzh(i.id, i.teh_obslyzh === "1" ? "0" : "1")
                                    },
                                ]}
                                position={j+4 >= cars.length ? "bottom" : "top"}
                    />
                </ActionContainer>
            }
        });

        const selectOptions = [
            {value:0, label: "Все"},
            {value:1, label: "Активный"},
            {value:2, label: "Неактивные"}
        ];


        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <ReactSelect value={status}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите тип"}
                                     onChange={this.onChangeType}
                                     options={selectOptions}/>
                    </Filters>
                    <Button title={"Добавить водителя"}
                            height="40px"
                            onClick={() => this.setState({openPopupCreate: "new"})}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={cars}/>
                </Body>
                {
                    openPopupLicense &&
                    <ChangeLicensePopup onClose={() => this.setState({openPopupLicense: false})}
                                        item={openPopupLicense}
                                        onUpdate={this.load}/>
                }
                {
                    openPopupCreate &&
                    <CreateCarParkPopup onClose={() => this.setState({openPopupCreate: false})}
                                        item={openPopupCreate}
                                        onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

CarParkPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default CarParkPage;
