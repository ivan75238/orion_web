import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import Close from "components/Icons/Close";
import Checkbox from "react-simple-checkbox";
import {API} from "components/API";
import AccessRights from "components/Elements/AccessRights";
import _get from "lodash/get";

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

@connect(state => ({
    user: _get(state.app, "user")
}))
class TypeTicketsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.load();
        this.state = {
            typeTickets: []
        }
    }

    columns = [
        {
            name: "name",
            title: "Тип билета",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "fix",
            title: "Фикс. цена",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "cost",
            title: "Цена",
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
        document.title = "Типы билетов";
    }

    load = () => {
        API.bilet.get()
            .then(response => {
                const resp = response.data;
                this.setState({typeTickets: resp});
            })
    };

    render() {
        let {typeTickets} = this.state;
        const {user} = this.props;

        if (user.role === "0")
            return <AccessRights/>;

        typeTickets = typeTickets.map(i => {
            return {
                ...i,
                fix: <Checkbox checked={i.fix === "1"}/>,
                actions: <ActionContainer>
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
                    <Button title={"Добавить запись"}
                            height="40px"
                            onClick={() => {}}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={typeTickets}/>
                </Body>
            </ContentWrapper>
        )
    }
}

TypeTicketsPage.propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
};

export default TypeTicketsPage;
