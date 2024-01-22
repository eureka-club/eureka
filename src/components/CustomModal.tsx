import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface Props{
    title:string;
    children: React.ReactNode;
    open:boolean;
    onCloseRequest:()=>void
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function CustomModal({title,children,open,onCloseRequest}:Props) {
  const handleClose = () => {
    onCloseRequest();
  };

  return (
    <React.Fragment>
    
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 0,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {children}
      </DialogContent>
    </BootstrapDialog>
  </React.Fragment>
  );
}