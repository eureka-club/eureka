import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader, Stack } from '@mui/material';
import HowIsItWorkRating from './HowIsItWorkRating';

export default function HowIsItWorkCard() {
  return (
    <Card sx={{minWidth:'375px'}}>
        <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack direction={'row'} gap={2}>
                <img width={53} height={53} src={'https://datapopalliance.org/wp-content/uploads/2023/12/Captura-de-Tela-2023-12-13-as-21.22.00-copia.webp'}/>
                <Stack>
                    <Typography><strong>Anna Silva</strong></Typography>
                    <Typography variant='subtitle1'>Marketing, Brasil</Typography>
                </Stack>
            </Stack>
            <HowIsItWorkRating/>
        </Stack>
      <CardActionArea>
        <CardContent>
          
          <Typography variant="body2" color="text.secondary">
          “Eureka Club me proporcionó un viaje increíble de aprendizaje y reflexión sobre la justicia social. Participar en el club me hizo replantear mi visión del mundo. Lo recomiendo a todos los que deseen expandir sus horizontes y actuar en pro de la justicia.”
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}