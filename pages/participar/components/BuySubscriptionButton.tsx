import { Button } from "@mui/material";
import { FC } from "react";

interface Props {
    label:string;
}   
const BuySubscriptionButton:FC<Props> = ({label}) => { 
    const onClickHandle = (e:any) => {

    };   
    return (
        <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onClickHandle}
        >
            {label}
        </Button>
    );
}
export default BuySubscriptionButton;