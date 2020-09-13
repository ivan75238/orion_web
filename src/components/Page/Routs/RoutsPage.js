import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import axios from "axios";
import {apiUrl} from "config/config";
import Table from "components/Elements/Table";
import {appActions} from "reducers/actions";
import _orderBy from 'lodash/orderBy';

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
    max-height: calc(100vh - 182px);
`;

const TableWrapper = styled.div`
    width: 30%;
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 182px);
`;

const ButtonsContainer = styled.div`
    display: flex;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class RoutsPage extends PureComponent {
    constructor(props) {
        super(props);
        let selectRout;
        if (props.routs){
            if (props.routs.length > 0)
                selectRout = {value:props.routs[0].id, label: props.routs[0].name};
        }
        this.state = {
            rout: selectRout
        };
    }

    columns = [
        {
            name: "name",
            title: "Название",
            justifyContent: "center",
            flex: "1 0 150px"
        }
    ];

    componentDidMount() {
        document.title = "Маршруты";
    }

    getAllRout = () => {
        const {dispatch} = this.props;

        axios.get(`${apiUrl}Rout.GetAll`)
            .then(response => {
                const resp = response.data;
                dispatch({type: appActions.SET_ALL_ROUTS, routs: resp});

                resp.map(item => {
                    axios.get(`${apiUrl}Rout.GetLocality&id_rout=${item.id}`)
                        .then(response => {
                            const resp = response.data;
                            dispatch({type: appActions.SET_ROUT_LOCATIONS, locations: resp, routid: item.id});
                        })
                });
            })
    };

    render() {
        let {rout} = this.state;
        const {routs} = this.props;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });
        let selectedRoutData, locations = [];
        if (rout){
            selectedRoutData = routs.find(i => i.id === rout.value);
            locations = _orderBy(selectedRoutData.locations, i => i.position);
        }
        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <ReactSelect value={rout}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите маршрут"}
                                     onChange={value => this.setState({rout: value})}
                                     options={selectOptions}/>
                    </Filters>
                    <ButtonsContainer>
                        <Button title={"Новый"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => {}}/>
                        <Button title={"Изменить"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => {}}/>
                        <Button title={"Удалить"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => {}}/>
                        <Button title={"Архив"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => {}}/>
                        <Button title={"Справочник пунктов"}
                                height="40px"
                                onClick={() => {}}/>
                    </ButtonsContainer>
                </Header>
                <Body>
                    <iframe src={selectedRoutData && selectedRoutData.url_map}
                            width={"70%"}/>
                    <TableWrapper>
                        <Table columns={this.columns}
                               items={locations}/>
                    </TableWrapper>
                </Body>
            </ContentWrapper>
        )
    }
}

RoutsPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default RoutsPage;
