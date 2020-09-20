import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import CustomDatePicker from "components/Elements/DatePicker";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import Table from "components/Elements/Table";
import {API} from "components/API";

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
`;

const Text = styled.p`
    font-size: 14px;
    margin-bottom: 0;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class ReportParkPage extends PureComponent {
    state = {
        dateStart: new Date(new Date().setMonth(new Date().getMonth()-1)),
        dateEnd: new Date(),
        dataTable: [],
        cars: []
    };

    columns = [
        {
            name: "voditel",
            title: "Водитель",
            justifyContent: "flex-start",
            textAlign: "left",
            flex: "1 0 250px"
        },
        {
            name: "trips",
            title: "Количество рейсов",
            justifyContent: "center",
            flex: "1 0 120px"
        },
        {
            name: "CountOrderForOtcehtCars",
            title: "Количество заказов",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "SummaruCoutForOtchetCars",
            title: "Общая сумма",
            justifyContent: "center",
            flex: "1 0 120px"
        },
        {
            name: "SrCoutOnTripForOtchetpark",
            title: "Средняя выручка (на 1 поездку)",
            justifyContent: "center",
            flex: "1 0 120px"
        },
        {
            name: "SrCoutOnOrderForOtchetpark",
            title: "Средняя выручка (на 1 место)",
            justifyContent: "center",
            flex: "1 0 120px"
        }
    ];

    search = () => {
        let {dateStart, dateEnd} = this.state;
        if (!dateStart) {
            toast.warn("Выберите первый день");
            return;
        }
        if (!dateEnd) {
            toast.warn("Выберите последний день");
            return;
        }
        API.park.getCars(0)
            .then(response => {
                const cars = response.data;
                this.setState({cars});
                cars.map(async i => {
                    if (i.id !== "0"){
                        let CountOrderForOtcehtCars = 0;
                        let SummaruCoutForOtchetCars = 0;
                        let SrCoutOnTripForOtchetpark = 0;
                        let SrCoutOnOrderForOtchetpark = 0;
                        let trips = await API.trip.getTripsForOtchetPark(i.id, dateStart, dateEnd);
                        trips = trips.data;
                        trips.map(j => {
                            API.order.getOrdersForOtchetPark(j.id)
                                .then(response => {
                                    const orders = response.data;
                                    CountOrderForOtcehtCars += orders.length;
                                    orders.map(k => {
                                        SummaruCoutForOtchetCars += parseInt(k.cost);
                                    });
                                    if (trips.length === 0)
                                        SrCoutOnTripForOtchetpark =  0;
                                    else
                                        SrCoutOnTripForOtchetpark =  SummaruCoutForOtchetCars / trips.length;
                                    if (CountOrderForOtcehtCars === 0)
                                        SrCoutOnOrderForOtchetpark =  0;
                                    else
                                        SrCoutOnOrderForOtchetpark =  SummaruCoutForOtchetCars / CountOrderForOtcehtCars;
                                    const {dataTable} = this.state;
                                    const data = [...dataTable];
                                    data.push({
                                        id: i.id,
                                        voditel: i.voditel,
                                        trips: trips.length,
                                        CountOrderForOtcehtCars,
                                        SummaruCoutForOtchetCars,
                                        SrCoutOnTripForOtchetpark: (SrCoutOnTripForOtchetpark).toFixed(0),
                                        SrCoutOnOrderForOtchetpark: (SrCoutOnOrderForOtchetpark).toFixed(0)
                                    });
                                    this.setState({
                                        dataTable: data
                                    })
                                });
                        });
                    }
                })
            })
    };

    render() {
        let {dateStart, dateEnd, dataTable, cars} = this.state;

        const renderData = cars.map(car => {
            if (car.id !== "0") {
                const dataArr = dataTable.filter(row => row.id === car.id);
                const lastItem = dataArr.length > 0 ? dataArr[dataArr.length - 1] : null;
                return {
                    voditel: car.voditel,
                    trips: lastItem ? lastItem.trips : 0,
                    CountOrderForOtcehtCars: lastItem ? lastItem.CountOrderForOtcehtCars : 0,
                    SummaruCoutForOtchetCars: lastItem ? lastItem.SummaruCoutForOtchetCars : 0,
                    SrCoutOnTripForOtchetpark: lastItem ? lastItem.SrCoutOnTripForOtchetpark : 0,
                    SrCoutOnOrderForOtchetpark: lastItem ? lastItem.SrCoutOnOrderForOtchetpark : 0,
                }
            }
        }).filter(i => i);
        let trips = 0, CountOrderForOtcehtCars = 0, SummaruCoutForOtchetCars = 0, SrCoutOnTripForOtchetpark = 0, SrCoutOnOrderForOtchetpark = 0;
        renderData.map(i => {
            trips += i.trips;
            CountOrderForOtcehtCars += i.CountOrderForOtcehtCars;
            SummaruCoutForOtchetCars += i.SummaruCoutForOtchetCars;
            SrCoutOnTripForOtchetpark += parseInt(i.SrCoutOnTripForOtchetpark);
            SrCoutOnOrderForOtchetpark += parseInt(i.SrCoutOnOrderForOtchetpark);
        });
        renderData.push({
            voditel: "Общий итог",
            trips: trips,
            CountOrderForOtcehtCars: CountOrderForOtcehtCars,
            SummaruCoutForOtchetCars: SummaruCoutForOtchetCars,
            SrCoutOnTripForOtchetpark: (SrCoutOnTripForOtchetpark / renderData.length).toFixed(0),
            SrCoutOnOrderForOtchetpark: (SrCoutOnOrderForOtchetpark / renderData.length).toFixed(0),
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <Text>C:</Text>
                        <CustomDatePicker selected={dateStart}
                                          onChange={dateStart => this.setState({dateStart})}
                                          height="40px"
                                          width="140px"
                                          margin={"0 8px"}
                                          dateFormat="dd.MM.yyyy"/>
                        <Text>По:</Text>
                        <CustomDatePicker selected={dateEnd}
                                          onChange={dateEnd => this.setState({dateEnd})}
                                          height="40px"
                                          width="140px"
                                          margin={"0 8px"}
                                          dateFormat="dd.MM.yyyy"/>
                        <Button title={"Показать"}
                                height="40px"
                                onClick={this.search}/>
                    </Filters>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={renderData}/>
                </Body>
            </ContentWrapper>
        )
    }
}

ReportParkPage.propTypes = {
    dispatch: PropTypes.func
};

export default ReportParkPage;
