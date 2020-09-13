import React, {PureComponent} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledTable = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  overflow: auto;
  max-width: 100%;
`;

const Row = styled.div`
  min-height: 40px;
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
`;

const Header = styled(Row)`
  min-height: unset;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Column = styled.div`
  border-bottom: 1px solid #cdcdcd;
  min-height: 40px;
  height: auto;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  justify-content: ${props => props.justifyContent || "center"};
  flex: ${props => props.flex || ""};
  font-size: 13px;
  
  p {
    margin: 0;
    text-align: center;
  }
`;

const HeaderColumn = styled(Column)`
  border-bottom: 1px solid #666666;
  justify-content: center;
  flex: ${props => props.flex || ""};
  font-size: 14px;
  min-height: 50px;
`;

const NoItems = styled.div`
  min-height: 40px;
  height: auto;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  justify-content: center;
  color: #cdcdcd;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 22px;
`;

class Table extends PureComponent {

    render() {
        const {columns, items} = this.props;
        return (
            <>
                <Header>
                    {
                        columns.map((col, i) => {
                            return (
                                <HeaderColumn justifyContent={col.justifyContent}
                                        flex={col.flex}
                                        key={i}>
                                    <p>{col.title}</p>
                                </HeaderColumn>
                            )
                        })
                    }
                </Header>
                <StyledTable>
                    <Body>
                        {
                            items.length > 0 ?
                                items.map((item, i) => {
                                    return (
                                        <Row key={i}>
                                            {
                                                columns.map((col, j) => {
                                                    return (
                                                        <Column key={`${i}${j}`}
                                                                justifyContent={col.justifyContent}
                                                                flex={col.flex}>
                                                            <p>{item[col.name]}</p>
                                                        </Column>
                                                    )
                                                })
                                            }
                                        </Row>
                                    )
                                })
                            :
                                <NoItems>Данные отсутствуют</NoItems>
                        }
                    </Body>
                </StyledTable>
            </>
        )
    }
}

Table.propTypes = {
    columns: PropTypes.array,
    items: PropTypes.array,
};

export default Table;
