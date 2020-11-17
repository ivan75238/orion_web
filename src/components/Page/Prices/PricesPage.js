import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import Table from "components/Elements/Table";
import {API} from "components/API";
import AccessRights from "components/Elements/AccessRights";
import DropdownMenu from "components/Elements/DropdownMenu";
import EditPricePopup from "./EditPricePopup";
import CreatePricePopup from "components/Page/Prices/CreatePricePopup";

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
    max-height: calc(100vh - 182px);
    overflow-x: auto;
`;

const ActionContainer = styled.div`
    display: flex;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
    user: _get(state.app, "user")
}))
class PricesPage extends PureComponent {
    constructor(props) {
        super(props);
        let selectRout;
        if (props.routs){
            if (props.routs.length > 0)
                selectRout = {value:props.routs[0].id, label: props.routs[0].name};
        }
        this.state = {
            rout: selectRout,
            prices: [],
            openPopupEditPrice: false,
            openPopupCreatePrice: false,
        };
        if (selectRout)
            this.load();
    }

    columns = [
        {
            name: "Kyda",
            title: "Откуда",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "Otkyda",
            title: "Куда",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "cost",
            title: "Стоимость",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    componentDidMount() {
        document.title = "Прейскурант";
    }

    load = () => {
        const {rout} = this.state;
        if (!rout) {
            toast.warn("Выберите маршрут");
            return;
        }
        API.price.getPriceForMarsID(rout.value)
            .then(response => {
                const resp = response.data === "" ? [] : response.data;
                this.setState({prices: resp});
            })
    };

    render() {
        let {rout, prices, openPopupEditPrice, openPopupCreatePrice} = this.state;
        const {routs, user} = this.props;

        if (user.role === "0")
            return <AccessRights/>;

        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });

        prices = prices.map((i, j) => {
            return {
                ...i,
                actions: <ActionContainer>
                    <DropdownMenu items={[
                        {title: "Изменить стоимость", onClick: () => this.setState({openPopupEditPrice: i})},
                        {title: "Удалить", onClick: async () => {await await API.price.del(i.id); await this.load()}},
                    ]}
                                  position={j+4 >= prices.length ? "bottom" : "top"}
                    />
                </ActionContainer>
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите маршрут"}
                                     onChange={value => this.setState({rout: value}, () => this.load())}
                                     options={selectOptions}/>
                    </Filters>
                    <Button title={"Добавить запись"}
                            height="40px"
                            onClick={() => this.setState({openPopupCreatePrice: true})}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={prices}/>
                </Body>
                {
                    openPopupEditPrice &&
                    <EditPricePopup onClose={() => this.setState({openPopupEditPrice: false})}
                                       item={openPopupEditPrice}
                                       onUpdate={this.load}/>
                }
                {
                    openPopupCreatePrice &&
                    <CreatePricePopup onClose={() => this.setState({openPopupCreatePrice: false})}
                                      onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

PricesPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default PricesPage;
