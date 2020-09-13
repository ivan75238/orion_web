import React, {PureComponent} from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

const DPInputWrapper = styled.div`
  height: ${props => props.inputHeight || "auto"};
  width: ${props => props.inputWidth || "auto"};
  margin: ${props => props.margin || "auto"};

  input{
      width: 100%;
      padding: 6px 35px 6px 10px;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      height: ${props => props.inputHeight || "40px"};
    }

    input[disabled]{
      background-color: #F0F1F3 !important;
    }

  .react-datepicker-wrapper,
  .form-control,
   .react-datepicker__input-container {
    height: 100%;
  }

  input.form-control {
    border: 1px solid  #cdcdcd;
    box-shadow: none !important;
    outline: none;

    &:hover, &:focus {
      border: 1px solid #2D9CDB;
    }
    ::placeholder {
      color: #8B90A0;
      font-size: 13px;
    }
  }
`;

//Стилизованный button
class CustomDatePicker extends PureComponent {

    render() {
        const {height, selected, margin, onChange, width} = this.props;
        return (
            <DPInputWrapper inputHeight={height}
                            margin={margin}
                            inputWidth={width}>
                <DatePicker selected={selected}
                            onChange={onChange}
                            dateFormat="dd.MM.yyyy"/>
            </DPInputWrapper>
        )
    }
}

CustomDatePicker.propTypes = {
    height: PropTypes.string,
    margin: PropTypes.string,
    width: PropTypes.string,
    selected: PropTypes.object,
    onChange: PropTypes.func,
};

export default CustomDatePicker;
