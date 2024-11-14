import * as React from 'react';
import { BarChart, barLabelClasses } from '@mui/x-charts/BarChart';

interface Props{
  data:Record<string,any>,
  layoutHorizontal?:boolean
}
const Bar:React.FC<Props> = ({data,layoutHorizontal}) => {
  return (
    <BarChart
      { ...layoutHorizontal 
        ? {
          layout:'horizontal',
          yAxis:[{ scaleType: 'band', data: Object.keys(data) }]
        } 
        : {
          layout:'vertical',
          xAxis:[{ scaleType: 'band', data: Object.keys(data)}]
        }
      }
      series={[
        { data: Object.values(data) },
      ]}
      width={350}
      height={300}
      barLabel={(item, context) => {
        if(context.bar.width>50){
          let total = Object.values(data).reduce((p,c)=>p+c,0);
          if(total>0){
            let perc = (+item.value!*100)/total;
            if(perc==0)return null;
            return `${item.value} (${perc==100 ? perc : perc?.toFixed(1)}%)`;
          }
        }
        return `${item.value}`;
      }}
      grid={{ vertical: true }}
      borderRadius={1}
      sx={{
        [`& .${barLabelClasses.root}`]: {
          fontWeight: 'bold',
          fill:'white'
        },
      }}
    />
  );
}
export default Bar;