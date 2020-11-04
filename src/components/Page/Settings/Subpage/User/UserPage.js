import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Button from "components/Elements/Button";
import Table from "components/Elements/Table";
import Close from "components/Icons/Close";
import Edit from "components/Icons/Edit";
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

@connect(() => ({}))
class UserPage extends PureComponent {
    constructor(props) {
        super(props);
        this.load();
        this.state = {
            users: []
        }
    }

    columns = [
        {
            name: "name",
            title: "ФИО",
            justifyContent: "center",
            flex: "1 0 150px"
        },
        {
            name: "role",
            title: "Роль",
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

    load = () => {
        API.user.getUsers()
            .then(response => {
                const resp = response.data;
                this.setState({users: resp});
            })
    };

    translateRole = role => {
        switch(role) {
            case "0":
                return "Диспетчер";
            case "1":
                return "Администратор";
        }
    };

    render() {
        let {users} = this.state;

        users = users.map(i => {
            return {
                ...i,
                role: this.translateRole(i.role),
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
                    <Button title={"Добавить"}
                            height="40px"
                            onClick={() => {}}/>
                </Header>
                <Body>
                    <Table columns={this.columns}
                           items={users}/>
                </Body>
            </ContentWrapper>
        )
    }
}

UserPage.propTypes = {
    dispatch: PropTypes.func,
};

export default UserPage;
