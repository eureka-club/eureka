import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem,{MenuItemTypeMap} from '@mui/material/MenuItem';
import Link from 'next/link';
import { Typography } from '@mui/material';

export interface MenuActionProps{
    label:any;
    renderMenuItem?:(item:Record<string,any>&{label:any})=>React.ReactElement
    items:Record<string,any>&{label:any}[]
}
export default function MenuAction(props: MenuActionProps) {
    const{label,items,renderMenuItem}=props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {label}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
            items.map(i=><MenuItem onClick={()=>{
                handleClose();
            }}>
              {
                renderMenuItem 
                  ? renderMenuItem(i)
                  : <Typography sx={{color:'var(--color-primary)'}}>{i.label}</Typography>
              }
            </MenuItem>)
        }
      </Menu>
    </div>
  );
}
