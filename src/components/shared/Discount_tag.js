import React from "react";

const Discount = ({price , discount}) => {

    
    const discountPrecentage = (discount / price ) * 100;
    const discountTagStyle = {
        position: 'absolute',
        left: '5%',
        backgroundColor: '#34A853',
        color: 'white',
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: 'bold',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 83% 89%, 64% 100%, 40% 90%, 18% 100%, 0 90%)',
        zIndex: 1
        
    };
    return(
        <>
            <div className="dis_tag" style={discountTagStyle} isVisible>
                {Math.ceil(discountPrecentage)} %<br/>
                 OFF</div>
        </>
    )
}

export default Discount;