import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import moment from "moment";
import ReactSelect from "components/Elements/ReactSelect";
import {API} from "components/API";
import AccessRights from "components/Elements/AccessRights";
import _get from "lodash/get";
import EditWorkPlanPopup from "./EditWorkPlanPopup";

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

const LoadingWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    
    p {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 0;
        color: #fff;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
`;

@connect(state => ({
    user: _get(state.app, "user")
}))
class WorkPlanPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            plans: [],
            selectedPlan: null,
            tableData: [],
            loading: false,
            openPopup: false
        };
        this.load();
    }

    load = () => {
        const {selectedPlan} = this.state;
        API.workPlan.get()
            .then(response => {
                const resp = response.data;
                this.setState({plans: resp});
                if (selectedPlan) {
                    this.loadTableData(selectedPlan);
                }
            })
    };

    loadTableData = (selectedPlan) => {
        let {plans} = this.state;
        const plan = plans.find(i => i.id === selectedPlan.value);
        //Данные за январь
        const newData = [];
        this.setState({loading: true});
        let date_start = moment(`01.01.${selectedPlan.label}`);
        let date_end = date_start.clone().endOf('month');
        API.workPlan.getCountOrder(date_start, date_end)
            .then(response => {
                const resp = response.data;
                newData.push({month: "Январь", plan: plan.january, real: resp});

                //Данные за февраль
                date_start = moment(`01.02.${selectedPlan.label}`);
                date_end = date_start.clone().endOf('month');
                API.workPlan.getCountOrder(date_start, date_end)
                    .then(response => {
                        const resp = response.data;
                        newData.push({month: "Февраль", plan: plan.february, real: resp});

                        //Данные за март
                        date_start = moment(`01.03.${selectedPlan.label}`);
                        date_end = date_start.clone().endOf('month');
                        API.workPlan.getCountOrder(date_start, date_end)
                            .then(response => {
                                const resp = response.data;
                                newData.push({month: "Март", plan: plan.march, real: resp});

                                //Данные за апрель
                                date_start = moment(`01.04.${selectedPlan.label}`);
                                date_end = date_start.clone().endOf('month');
                                API.workPlan.getCountOrder(date_start, date_end)
                                    .then(response => {
                                        const resp = response.data;
                                        newData.push({month: "Апрель", plan: plan.april, real: resp});

                                        //Данные за май
                                        date_start = moment(`01.05.${selectedPlan.label}`);
                                        date_end = date_start.clone().endOf('month');
                                        API.workPlan.getCountOrder(date_start, date_end)
                                            .then(response => {
                                                const resp = response.data;
                                                newData.push({month: "Май", plan: plan.may, real: resp});

                                                //Данные за июнь
                                                date_start = moment(`01.06.${selectedPlan.label}`);
                                                date_end = date_start.clone().endOf('month');
                                                API.workPlan.getCountOrder(date_start, date_end)
                                                    .then(response => {
                                                        const resp = response.data;
                                                        newData.push({month: "Июнь", plan: plan.june, real: resp});

                                                        //Данные за июль
                                                        date_start = moment(`01.07.${selectedPlan.label}`);
                                                        date_end = date_start.clone().endOf('month');
                                                        API.workPlan.getCountOrder(date_start, date_end)
                                                            .then(response => {
                                                                const resp = response.data;
                                                                newData.push({month: "Июль", plan: plan.july, real: resp});

                                                                //Данные за август
                                                                date_start = moment(`01.08.${selectedPlan.label}`);
                                                                date_end = date_start.clone().endOf('month');
                                                                API.workPlan.getCountOrder(date_start, date_end)
                                                                    .then(response => {
                                                                        const resp = response.data;
                                                                        newData.push({month: "Август", plan: plan.august, real: resp});

                                                                        //Данные за сентябрь
                                                                        date_start = moment(`01.09.${selectedPlan.label}`);
                                                                        date_end = date_start.clone().endOf('month');
                                                                        API.workPlan.getCountOrder(date_start, date_end)
                                                                            .then(response => {
                                                                                const resp = response.data;
                                                                                newData.push({month: "Сентябрь", plan: plan.september, real: resp});

                                                                                //Данные за октябрь
                                                                                date_start = moment(`01.10.${selectedPlan.label}`);
                                                                                date_end = date_start.clone().endOf('month');
                                                                                API.workPlan.getCountOrder(date_start, date_end)
                                                                                    .then(response => {
                                                                                        const resp = response.data;
                                                                                        newData.push({month: "Октябрь", plan: plan.october, real: resp});

                                                                                        //Данные за ноябрь
                                                                                        date_start = moment(`01.11.${selectedPlan.label}`);
                                                                                        date_end = date_start.clone().endOf('month');
                                                                                        API.workPlan.getCountOrder(date_start, date_end)
                                                                                            .then(response => {
                                                                                                const resp = response.data;
                                                                                                newData.push({month: "Ноябрь", plan: plan.november, real: resp});

                                                                                                //Данные за декабрь
                                                                                                date_start = moment(`01.12.${selectedPlan.label}`);
                                                                                                date_end = date_start.clone().endOf('month');
                                                                                                API.workPlan.getCountOrder(date_start, date_end)
                                                                                                    .then(response => {
                                                                                                        const resp = response.data;
                                                                                                        newData.push({month: "Декабрь", plan: plan.december, real: resp});

                                                                                                        this.setState({
                                                                                                            tableData: newData,
                                                                                                            loading: false
                                                                                                        });
                                                                                                    })
                                                                                            })
                                                                                    })
                                                                            })
                                                                    })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    };

    componentDidMount() {
        document.title = "План работы";
    }

    columns = [
        {
            name: "month",
            title: "Месяц",
            justifyContent: "center",
            flex: "1 0 200px"
        },
        {
            name: "plan",
            title: "Плановый показатель",
            justifyContent: "center",
            flex: "1 0 200px"
        },
        {
            name: "real",
            title: "Фактический показатель",
            justifyContent: "center",
            flex: "1 0 200px"
        }
    ];

    onChange = value => {
        this.setState({selectedPlan: value});
        this.loadTableData(value);
    };

    render() {
        let {plans, selectedPlan, tableData, loading, openPopup} = this.state;
        const {user} = this.props;

        if (user.role === "0")
            return <AccessRights/>;

        const renderPlans = plans.map(i => {return {value:i.id, label: moment(i.year).format("YYYY")}});

        return (
            <ContentWrapper>
                {
                    loading &&
                        <LoadingWrapper>
                            <p>Загрузка</p>
                        </LoadingWrapper>
                }
                <Header>
                    <Filters>
                        <ReactSelect value={selectedPlan}
                                     height="40px"
                                     width="220px"
                                     margin={"0 0 0 16px"}
                                     placeholder={"Выберите год"}
                                     onChange={this.onChange}
                                     options={renderPlans}/>
                    </Filters>
                    <ButtonsContainer>
                        <Button title={"Создать"}
                                height="40px"
                                margin={"0 8px 0 0"}
                                onClick={() => this.setState({openPopup: "new"})}/>
                        {
                            selectedPlan &&
                                <>
                                    <Button title={"Редактировать"}
                                            height="40px"
                                            margin={"0 8px 0 0"}
                                            onClick={() => this.setState({openPopup: plans.find(i => i.id === selectedPlan.value)})}/>
                                    <Button title={"Удалить"}
                                            height="40px"
                                            onClick={async () => {
                                                await API.workPlan.del(selectedPlan.value);
                                                this.setState({selectedPlan: null, tableData: []}, () => {
                                                    this.load();
                                                })
                                            }}/>
                                </>
                        }
                    </ButtonsContainer>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={tableData}/>
                </Body>
                {
                    openPopup &&
                    <EditWorkPlanPopup onClose={() => this.setState({openPopup: false})}
                                   item={openPopup}
                                   onUpdate={this.load}/>
                }
            </ContentWrapper>
        )
    }
}

WorkPlanPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array,
    user: PropTypes.object,
};

export default WorkPlanPage;
