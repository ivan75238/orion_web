import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {API} from "components/API";
import styled from "styled-components";
import Table from "components/Elements/Table";
import Edit from "components/Icons/Edit";
import Close from "components/Icons/Close";
import EditLocalityPopup from "./EditLocalityPopup";

const TableWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
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
    user: _get(state.app, "user"),
}))
class DictionaryLocalityPopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            localities: [],
            openPopup: false
        };
        this.load();
    }

    load = async() => {
        await API.rout.getAllLocality()
            .then(response => {
                const resp = response.data;
                this.setState({localities: resp});
            })
    };

    columns = [
        {
            name: "name",
            title: "Название",
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

    render() {
        const {onClose} = this.props;
        let {localities, openPopup} = this.state;

        localities = localities.map(i => {
            return {
                ...i,
                actions: <ActionContainer>
                    <IconContainer onClick={() => this.setState({openPopup: i})}>
                        <Edit/>
                    </IconContainer>
                    <IconContainer onClick={async () => {await API.rout.delLocality(i.id); this.load()}}>
                        <Close/>
                    </IconContainer>
                </ActionContainer>
            }
        });

        return (
            <Popup onClose={onClose}
                   title={"Справочник промежуточных пунктов"}
                   width={"400px"}
                   buttons={null}>
                <Wrapper>
                    <ButtonsContainer>
                        <Button title={"Добавить новый"}
                                height="40px"
                                width="100%"
                                margin={"0 0 8px 0"}
                                onClick={() => this.setState({openPopup: "new"})}/>
                    </ButtonsContainer>
                    <TableWrapper>
                        <Table columns={this.columns}
                               items={localities}/>
                    </TableWrapper>
                    {
                        openPopup &&
                        <EditLocalityPopup onClose={() => this.setState({openPopup: false})}
                                           item={openPopup}
                                           onUpdate={this.load}/>
                    }
                </Wrapper>
            </Popup>
        )
    }
}

DictionaryLocalityPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default DictionaryLocalityPopup;
