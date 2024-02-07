import { Button, ButtonGroup, IconButton } from "@mui/material"
import { useRouter } from "next/router";
import { ReactElement } from "react"
import { BiArrowBack } from "react-icons/bi";

interface Props{
  children?: any;
}
export const ButtonsTopActions = (props:Props)=>{
    const router = useRouter();
    return <ButtonGroup
        disableElevation
        variant="contained"
        size="small"
        >
            <Button 
            color="primary"
            onClick={() => router.back()}
            >
                <span style={{width:'0px'}}>&nbsp;</span>
                <BiArrowBack />
            </Button>
            {props.children}
    </ButtonGroup>
}