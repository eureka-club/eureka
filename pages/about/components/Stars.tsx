import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function Stars() {
  return (
    <Stack spacing={1}>
      <Rating name="size-small" defaultValue={5} size="small" disabled />
    </Stack>
  );
}


