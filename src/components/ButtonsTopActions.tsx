import { Button, ButtonGroup } from "@mui/material"
import { useRouter } from "next/router";
import { ReactElement } from "react"
import { BiArrowBack } from "react-icons/bi"

interface Props{
  children?: ReactElement | ReactElement[];
}
export const ButtonsTopActions = (props:Props)=>{
    const router = useRouter();
    return <ButtonGroup
        disableElevation
        variant="contained"
        >
            <Button 
            size='small' 
            color="primary"
            onClick={() => router.back()}
            >
                <BiArrowBack />
            </Button>
            {props.children}
    </ButtonGroup>
}