import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Button from "components/Elements/Button";
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

const SmsText = styled.p`
    margin-bottom: 0;
    font-size: 14px;
`;

@connect(() => ({}))
class SmsPage extends PureComponent {
    constructor(props) {
        super(props);
        this.load();
        this.state = {
            balance: 0
        }
    }

    componentDidMount() {
        document.title = "СМС";
    }

    load = () => {
        API.sms.getBalance()
            .then(response => this.setState({balance: response.data}))
    };

    render() {
        let {balance} = this.state;
        return (
            <ContentWrapper>
                <Header>
                    <Filters>
                        <SmsText>Баланс: {balance} Р</SmsText>
                        <Button title={"Обновить"}
                                height="40px"
                                margin={"0 0 0 16px"}
                                onClick={() => this.load()}/>
                    </Filters>
                </Header>
            </ContentWrapper>
        )
    }
}

SmsPage.propTypes = {
    dispatch: PropTypes.func,
};

export default SmsPage;
