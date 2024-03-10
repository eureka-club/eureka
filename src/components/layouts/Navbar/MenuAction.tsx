import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem,{MenuItemTypeMap} from '@mui/material/MenuItem';
import Link from 'next/link';
import { Tooltip, Typography } from '@mui/material';

export interface MenuActionProps{
    label:any;
    title?:string;
    renderMenuItem?:(item:Record<string,any>&{label:any})=>React.ReactElement
    items:Record<string,any>&{label:any}[]
}
export default function MenuAction(props: MenuActionProps) {
    const{label,title,items,renderMenuItem}=props;
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
      <Tooltip title={title??''}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {label}
        </Button>
      </Tooltip>
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
            items.map((i,idx)=><MenuItem onClick={()=>{
                handleClose();
            }}>
                <React.Fragment key={`${i}|${idx}`}>
                {
                  renderMenuItem 
                    ? renderMenuItem(i)
                    : <Typography sx={{color:'var(--color-primary)'}}>{i.label}</Typography>
                }
                </React.Fragment>
            </MenuItem>)
        }
      </Menu>
    </div>
  );
}
