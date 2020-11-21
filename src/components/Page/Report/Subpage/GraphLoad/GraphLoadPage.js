import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import CustomDatePicker from "components/Elements/DatePicker";
import _get from "lodash/get";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import {API} from "components/API";
import moment from "moment";
import LoaderSvg from "components/Elements/LoaderSvg";
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const Plot = createPlotlyComponent(Plotly);

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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const FiltersLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
`;

const Body = styled.div`
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 222px);
    overflow-x: auto;
    position: relative;
`;

const Text = styled.p`
    font-size: 14px;
    margin-bottom: 0;
`;

@connect(state => ({
    routs: _get(state.app, "routs"),
}))
class GraphLoadPage extends PureComponent {
    state = {
        dateStart: new Date(new Date().setMonth(new Date().getMonth()-1)),
        dateEnd: new Date(),
        grapData: [],
        loading: false
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

    search = async () => {
        let {dateStart, dateEnd} = this.state;
        let {routs} = this.props;
        if (!dateStart) {
            toast.warn("Выберите первый день");
            return;
        }
        if (!dateEnd) {
            toast.warn("Выберите последний день");
            return;
        }
        this.setState({loading: true});
        const axisXData = [], lines = [];
        const countDays = moment(dateEnd).diff(moment(dateStart), 'days') + 1;
        let dateStartClone = moment(dateStart).clone();
        new Array(countDays).fill(0).map(() => {
            axisXData.push(dateStartClone.format("DD.MM.YYYY"));
            dateStartClone.add(1, "days");
        });
        await Promise.all(routs.map(async (item) => {
            const axisYData = [];
            await Promise.all(axisXData.map(async (day) => {
                const countOrder = await API.order.getOrderCount(moment(day, "DD.MM.YYYY"), item.id, 0);
                axisYData.push(countOrder);
            }));
            lines.push({
                x: axisXData,
                y: axisYData,
                text: item.name,
                name: item.name,
                hoverinfo: "y+text",
                line: {
                    shape: "spline",
                    width: 1,
                },
                mode:"lines+markers",

            });
        }));
        this.setState({
            grapData: lines,
            loading: false
        });
    };

    render() {
        let {dateStart, dateEnd, grapData, loading} = this.state;

        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <FiltersLeft>
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
                        </FiltersLeft>
                        {
                            loading &&
                            <LoaderWrapper>
                                <LoaderSvg/>
                            </LoaderWrapper>
                        }
                    </Filters>
                </Header>
                <Body>
                <Plot layout={{
                                autosize: true,
                                title: '',
                                padding: '0px',
                                hovermode:'closest',
                                legend: {
                                    bgcolor: "transparent",
                                },
                            }}
                            config={{
                                displaylogo: false,
                                responsive: true,
                                modeBarButtonsToRemove: ['lasso2d','select2d','resetScale2d','toggleSpikelines','hoverCompareCartesian','hoverClosestCartesian', "zoomIn2d", "zoom2d", "zoomOut2d"]
                            }}
                            style={{ width: '100%', height: '100%'}}
                            data={grapData}/>
                </Body>
            </ContentWrapper>
        )
    }
}

GraphLoadPage.propTypes = {
    dispatch: PropTypes.func,
    routs: PropTypes.array
};

export default GraphLoadPage;
