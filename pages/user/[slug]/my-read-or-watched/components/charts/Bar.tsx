import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
 


let data = {
    Femenino:3,
    Masculino:18,
    Trans:1,
    'No-binário':2,
    'Otro':4    
}

interface Props{
  data:Record<string,any>,
  layoutHorizontal?:boolean
}
const Bar:React.FC<Props> = ({data,layoutHorizontal}) => {
  return (
    <BarChart
      {...layoutHorizontal ? {layout:'horizontal'} : {layout:'vertical'}}
      xAxis={[
        { 
          scaleType: 'band', 
          data: Object.keys(data)
        }
      ]}
      series={[
        { data: Object.values(data) },
      ]}
      width={500}
      height={300}
    />
  );
}
export default Bar;