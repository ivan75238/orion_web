import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import Popup from "components/Elements/Popup";
import Button from "components/Elements/Button";
import {connect} from "react-redux";
import _get from "lodash/get";
import {API} from "components/API";
import styled from "styled-components";
import Table from "components/Elements/Table";

const TableWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ActionContainer = styled.div`
    display: flex;
`;


@connect(state => ({
    user: _get(state.app, "user"),
}))
class ArchivedRoutsPopup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            routs: []
        };
        this.load();
    }

    load = async() => {
        await API.rout.getArchived()
            .then(response => {
                const resp = response.data;
                this.setState({routs: resp});
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

    unarchive = async (id) => {
        await API.rout.unarchive(id);
        await this.load();
        this.props.onUpdate();
    };

    render() {
        const {onClose} = this.props;
        let {routs} = this.state;

        routs = routs.map(i => {
            return {
                ...i,
                actions: <ActionContainer>
                    <Button title={"Восстановить"}
                            height="40px"
                            width="100%"
                            margin={"0 0 8px 0"}
                            onClick={() => this.unarchive(i.id)}/>
                </ActionContainer>
            }
        });

        return (
            <Popup onClose={onClose}
                   title={"Архив маршрутов"}
                   width={"400px"}
                   buttons={null}>
                <Wrapper>
                    <TableWrapper>
                        <Table columns={this.columns}
                               items={routs}/>
                    </TableWrapper>
                </Wrapper>
            </Popup>
        )
    }
}

ArchivedRoutsPopup.propTypes = {
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    user: PropTypes.object,
    item: PropTypes.any,
};

export default ArchivedRoutsPopup;
