import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

export interface MenuActionProps{
    label:any;
    title?:string;
    renderMenuItem?:(item:Record<string,any>&{label:any})=>React.ReactElement
    items?:Record<string,any>&{label:any,link?:string}[];
    children?:React.ReactElement;
}
export default function MenuAction(props: MenuActionProps) {
    const{label,title,items,renderMenuItem,children}=props;
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
          sx={{textTransform:'capitalize'}}
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
          items 
            ? items.map((i,idx)=><MenuItem key={`${i}|${idx}`} onClick={()=>{
                handleClose();
            }}>
                <>
                {
                  renderMenuItem 
                    ? renderMenuItem(i)
                    : i.link 
                      ? <Link href={i.link}><Typography sx={{color:'var(--color-primary)'}}>{i.label}</Typography></Link> 
                      : <Typography sx={{color:'var(--color-primary)'}}>{i.label}</Typography>
                }
                </>
            </MenuItem>)
            : children
        }
      </Menu>
    </div>
  );
}
