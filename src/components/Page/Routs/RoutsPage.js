import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import _get from "lodash/get";
import ReactSelect from "components/Elements/ReactSelect";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import _orderBy from 'lodash/orderBy';
import DictionaryLocalityPopup from "./DictionaryLocality/DictionaryLocalityPopup";
import ArchivedRoutsPopup from "components/Page/Routs/ArchivedRoutsPopup";
import {API} from "components/API";
import {appActions} from "reducers/actions";

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
    overflow-x: auto;
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
            rout: selectRout,
            openPopupDictionary: false,
            openPopupArchived: false,
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

    load = () => {
        const {dispatch} = this.props;

        API.rout.getAll()
            .then(response => {
                const resp = response.data;
                dispatch({type: appActions.SET_ALL_ROUTS, routs: resp});

                resp.map(item => {
                    API.rout.getLocality(item.id)
                        .then(response => {
                            const resp = response.data;
                            dispatch({type: appActions.SET_ROUT_LOCATIONS, locations: resp, routid: item.id});
                        })
                });
            })
    };

    archive = async () => {
        let {rout} = this.state;
        await API.rout.archive(rout.value);
        this.load();
    };

    render() {
        let {rout, openPopupDictionary, openPopupArchived} = this.state;
        const {routs} = this.props;
        const selectOptions = routs.map(i => {
            return {value:i.id, label: i.name};
        });
        let selectedRoutData, locations = [];
        if (rout){
            selectedRoutData = routs.find(i => i.id === rout.value);
            if (!selectedRoutData){
                this.setState({rout: null});
            }
            else {
                locations = _orderBy(selectedRoutData.locations, i => parseInt(i.position));
            }
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
                        {
                            rout &&
                                <>
                                    <Button title={"Изменить"}
                                            height="40px"
                                            margin={"0 8px 0 0"}
                                            onClick={() => {}}/>
                                    <Button title={"Отправить в архив"}
                                            height="40px"
                                            margin={"0 8px 0 0"}
                                            onClick={() => this.archive()}/>
                                </>
                        }
                        <Button title={"Архив"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => this.setState({openPopupArchived: true})}/>
                        <Button title={"Справочник пунктов"}
                                height="40px"
                                onClick={() => this.setState({openPopupDictionary: true})}/>
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
                {
                    openPopupDictionary &&
                    <DictionaryLocalityPopup onClose={() => this.setState({openPopupDictionary: false})}/>
                }
                {
                    openPopupArchived &&
                    <ArchivedRoutsPopup onClose={() => this.setState({openPopupArchived: false})}
                                        onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

RoutsPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
};

export default RoutsPage;
