import React from "react";
import PropTypes from "prop-types";

const IconHumburger = ({ className, onClick}) => {
    return (
        <svg className={className}
             onClick={onClick}
             width="16" height="14"
             x="0px" y="0px"
             viewBox="0 0 512 512"
             fill="#fff"
             style={{minWidth: '32px', height: '32px'}}
             xmlns="http://www.w3.org/2000/svg">
                <g>
                    <g>
                        <path d="M492,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h472c11.046,0,20-8.954,20-20S503.046,236,492,236z"/>
                    </g>
                </g>
                                <g>
                    <g>
                        <path d="M492,76H20C8.954,76,0,84.954,0,96s8.954,20,20,20h472c11.046,0,20-8.954,20-20S503.046,76,492,76z"/>
                    </g>
                </g>
                                <g>
                    <g>
                        <path d="M492,396H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h472c11.046,0,20-8.954,20-20    C512,404.954,503.046,396,492,396z"/>
                    </g>
                </g>
        </svg>
    )
};

IconHumburger.propTypes = {
    className: PropTypes.any,
    onClick: PropTypes.func
};


export {IconHumburger};
