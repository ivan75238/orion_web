import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import styled from "styled-components";
import {API} from "components/API";
import moment from "moment";
import EditClientPopup from "components/Page/Clients/EditClientPopup";
import ClientHistoryPopup from "components/Page/Clients/ClientHistoryPopup";

const ColumnsWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 170px;
    margin-right: 16px;
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Avatar = styled.img`
    width: 170px;
    margin-bottom: 16px;
`;

const Label = styled.p`
    font-family: Roboto,sans-serif;
    font-size: ${props => props.fontSize || "18px"};
    color: #000;
    margin-bottom: ${props => props.marginBottom || "16px"};
`;

@connect(state => ({
    user: _get(state.app, "user"),
}))
class ClientCardPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            client: {},
            openPopupEditClient: false,
            openPopupHistory: false,
        }
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        API.client.get(this.props.item.id)
            .then(response => {
                this.setState({client: response.data});
            });
    };

    render() {
        const {onClose, onUpdate} = this.props;
        const {client, openPopupEditClient, openPopupHistory} = this.state;

        if (!client)
            return null;

        //const avatar = client.avatar ? "https://orion38.info/image/avatar/"+client.avatar :
        //    "https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png";

        const avatar = "https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png";

        return (
            <Popup onClose={() => {onClose(); onUpdate();}}
                   title={"Карточка клиента"}
                   width={"500px"}
                   buttons={null}>
                <ColumnsWrapper>
                    <LeftColumn>
                        <Avatar src={avatar}/>
                        <Button title={"Редактировать"}
                                height="40px"
                                margin="0 0 8px 0"
                                onClick={() => this.setState({openPopupEditClient: client})}/>
                        <Button title={"История рейсов"}
                                height="40px"
                                onClick={() => this.setState({openPopupHistory: client})}/>
                    </LeftColumn>
                    <RightColumn>
                        <Label marginBottom={"24px"}>{client.fio}</Label>
                        <Label fontSize={"15px"}>
                            {`Дата рождения: ${moment(client.date).format("DD.MM.YYYY") !== "01.01.1900" ? moment(client.date).format("DD.MM.YYYY") : "не указана"}`}
                        </Label>
                        <Label fontSize={"15px"}>
                            {`Номер телефона: ${client.phone}`}
                        </Label>
                        <Label fontSize={"15px"}>
                            {`Email: ${client.email ? client.email : "не указан"}`}
                        </Label>
                        <Label fontSize={"15px"}>
                            {`Количество рейсов: ${client.count}`}
                        </Label>
                        <Label fontSize={"15px"}>
                            {`Общая сумма: ${client.cost} ₽`}
                        </Label>
                    </RightColumn>
                </ColumnsWrapper>
                {
                    openPopupEditClient &&
                    <EditClientPopup onClose={() => this.setState({openPopupEditClient: false})}
                                     item={openPopupEditClient}
                                     onUpdate={this.load}/>
                }
                {
                    openPopupHistory &&
                    <ClientHistoryPopup onClose={() => this.setState({openPopupHistory: false})}
                                     item={openPopupHistory}
                                     onUpdate={this.load}/>
                }
            </Popup>
        )
    }
}

ClientCardPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default ClientCardPopup;
