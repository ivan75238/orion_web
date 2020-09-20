import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import Close from "components/Icons/Close";
import Edit from "components/Icons/Edit";
import moment from "moment";
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

const ActionContainer = styled.div`
    display: flex;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    
    &:hover {
        border: 1px solid #cdcdcd;
        border-radius: 3px;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

const Status = styled.div`
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    background: ${props => props.isActive ? "rgba(209, 205, 23, 0.5)" : "rgba(209, 23, 29, 0.5)"};    
    color: ${props => props.isActive ? "rgba(237, 186, 0, 1)" : "rgba(209, 23, 29, 1)"};    
    border: 1px solid ${props => props.isActive ? "rgba(209, 205, 23, 0.8)" : "rgba(209, 23, 29, 0.8)"};   
    border-radius: 5px; 
`;

@connect(() => ({}))
class NewsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.load();
        this.state = {
            news: []
        }
    }

    columns = [
        {
            name: "title",
            title: "Заголовок",
            justifyContent: "flex-start",
            textAlign: "left",
            flex: "1 0 150px"
        },
        {
            name: "messages",
            title: "Текст новости",
            justifyContent: "flex-start",
            textAlign: "left",
            flex: "1 0 300px"
        },
        {
            name: "date",
            title: "Дата публикации",
            justifyContent: "center",
            flex: "1 0 80px"
        },
        {
            name: "status",
            title: "Статус",
            justifyContent: "center",
            flex: "1 0 80px"
        },
        {
            name: "actions",
            title: "",
            justifyContent: "center",
            flex: "0 0 70px"
        }
    ];

    componentDidMount() {
        document.title = "Типы билетов";
    }

    load = () => {
        API.news.get()
            .then(response => {
                const resp = response.data;
                this.setState({news: resp});
            })
    };

    convertStatus = status => {
        switch (status) {
            case "0":
                return "Опубликована";
            case "1":
                return "Снята с публикации";
        }
    };

    render() {
        let {news} = this.state;

        news = news.map(i => {
            return {
                ...i,
                date: moment(i.date).format("DD.MM.YYYY HH:mm"),
                status: <Status isActive={i.status === "0"}>{this.convertStatus(i.status)}</Status>,
                actions: <ActionContainer>
                    <IconContainer onClick={() => {}}>
                        <Edit/>
                    </IconContainer>
                    <IconContainer onClick={() => {}}>
                        <Close/>
                    </IconContainer>
                </ActionContainer>
            }
        });

        return (
            <ContentWrapper>
                <Header>
                    <Filters/>
                    <Button title={"Добавить новость"}
                            height="40px"
                            onClick={() => {}}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={news}/>
                </Body>
            </ContentWrapper>
        )
    }
}

NewsPage.propTypes = {
    dispatch: PropTypes.func,
};

export default NewsPage;
