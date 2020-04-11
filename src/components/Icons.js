import React from "react";
import PropTypes from "prop-types";

const IconHumburger = ({ className, onClick}) => {
    return (
        <svg className={className}
             onClick={onClick}
             width="16" height="14"
             viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 0H0V2H16V0ZM16 4H0V6H16V4ZM0 8H16V10H0V8ZM16 12H0V14H16V12Z" fill="white"/>
        </svg>
    )
};

IconHumburger.propTypes = {
    className: PropTypes.any,
    onClick: PropTypes.func
};


export {IconHumburger};