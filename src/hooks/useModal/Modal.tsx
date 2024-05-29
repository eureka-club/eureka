import * as React from 'react';
import { Dialog, DialogProps } from '@mui/material';

export const Modal:React.FC<DialogProps> = ({open,onClose,...otherProps}) => {

  return (
        <Dialog
            open={open}
            onClose={onClose}
            {...otherProps}
        />
  );
}