import React, {PureComponent} from "react";
import styled from "styled-components";
import Input from "components/Elements/Input";
import Button from "components/Elements/Button";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {appActions} from "reducers/actions";
import connect from "react-redux/es/connect/connect";
import {API} from "components/API";

const ContentWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 400px;
    border-radius: 5px;
    border: 1px solid #cdcdcd;
    background: #fff;
`;

const TitleWrapper = styled.div`
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #cdcdcd;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.p`
    text-transform: uppercase;
    font-size: 18px; 
    margin: 0;
    color: #000;
    font-weight: 600;
`;

const InputWrapper = styled.div`
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

@connect(() => ({}))
class Auth extends PureComponent {
    state = {
       email: "",
       pass: ""
    };

    login = () => {
        const {email, pass} = this.state;
        const {updateSession, dispatch} = this.props;
        if (email === "") {
            toast.warn("Введите почту");
            return;
        }
        if (pass === "") {
            toast.warn("Введите пароль");
            return;
        }

        API.user.loginV2(email, pass)
            .then(response => {
                const resp = response.data;
                if (resp.result) {
                    //Кладем userid в localStorage
                    localStorage.setItem("ori_uid", resp.id);
                    dispatch({type: appActions.SET_AUTH_VALUE, auth: true});
                    dispatch({type: appActions.SET_AUTH_DATA, user: resp});
                    updateSession();
                } else {
                    toast.error(resp.msg);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                toast.error("При авторизации произошла ошибка, попробу  те позже или обратитесь к администратору");
            });
    };

    render() {
        const {email, pass} = this.state;
        return (
            <ContentWrapper>
                <Container>
                    <TitleWrapper>
                        <Title>Авторизация</Title>
                    </TitleWrapper>
                    <InputWrapper>
                        <Input width="100%"
                               value={email}
                               onChange={val => this.setState({email: val})}
                               title="Почта"
                               height="40px"
                               padding="8px 0"/>
                        <Input width="100%"
                               value={pass}
                               onChange={val => this.setState({pass: val})}
                               title="Пароль"
                               height="40px"
                               type={"password"}
                               margin="16px 0 0 0"
                               padding="8px 0"/>
                        <Button title={"Войти"}
                                height="40px"
                                onClick={this.login}
                                margin="16px 0 0 0"/>
                    </InputWrapper>
                </Container>
            </ContentWrapper>
        )
    }
}

Auth.propTypes = {
    updateSession: PropTypes.func,
    dispatch: PropTypes.func,
};

export default Auth;
