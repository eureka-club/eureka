import React,{FC, ReactElement, ReactNode, useEffect} from 'react';
import Box from '@mui/material/Box';
import Rating, { RatingProps } from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
interface Props {
 stop?:number;
 qty:number;
 onChange:(value:number)=>void;
 readonly?:boolean|undefined;
 size?:RatingProps["size"];
 icon?:ReactNode;
 emptyIcon?:ReactNode;
 
}

const RatingMUI:FC<Props> = ({qty,onChange,readonly,size=undefined,icon=undefined,emptyIcon=undefined}) => {
  const [value, setValue] = React.useState<number>(qty);
  useEffect(()=>{
    setValue(qty);
  },[qty])
  const icons = {
    icon:icon || <StarIcon style={{color:"var(--eureka-green)"}}/>,
    emptyIcon: emptyIcon || <StarOutlineIcon style={{color:"var(--eureka-grey)"}}/>
  }
  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Rating
        name="rating-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue||0);
          onChange(newValue||0);
        }}
        readOnly={readonly}
        precision={readonly ? 0.5 : 1} 
        size={size}
        icon={icons.icon }
        emptyIcon={icons.emptyIcon}
      />
    </Box>
  );
}
export default RatingMUI;