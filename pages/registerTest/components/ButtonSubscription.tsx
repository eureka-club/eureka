import { Button, Typography } from "@mui/material";
import Link from "next/link";

export default function(){
    return <Typography id='sub-btn' fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
    <style jsx global>{`
        #sub-btn{
            padding:.5rem 1rem;
            background-color: #7CF9F3;
            border-style: solid;
            border-radius: 10px 10px 10px 10px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
            animation:pulse 2s infinite cubic-bezier(.17,.67,.48,.07);
        }
        #sub-btn button{
            color: #000000!important;
            font-weight: bold;
            font-size: 1rem;
            font-family: "Open Sans", Helvetica;
            text-transform: uppercase;
        }
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                border-radius: 0px;
            }
        
            50% {
                transform: scale(1.05);
                border-radius: 15px;
            }
        }
    `}</style>
            <Button>Inscríbete en el club</Button>
</Typography>
}