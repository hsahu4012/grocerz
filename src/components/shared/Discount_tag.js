import React from "react";

const Discount = ({price , discount}) => {

    
    const discountPrecentage = (discount / price ) * 100;
    
    return(
        <>
            <div className="dis_tag"  isVisible>
                {Math.ceil(discountPrecentage)} %<br/>
                 OFF</div>
        </>
    )
}

export default Discount;