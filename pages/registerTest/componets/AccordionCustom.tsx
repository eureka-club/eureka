import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const data = [
  {
    header:'la revolucion cubana es lo maximo',
    body:'b'
  },
  {
    header:'viva Diaz Canel!!',
    body:'b1'
  },
  {
    header:'La antonia guiteras es la mejor termoelectrica del mundo, mucha eficiencia!',
    body:'b2'
  }
]
export default function AccordionCustom() {
  return (
    <div>
      {
        data.map(d=>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
            {d.header}
            </AccordionSummary>
              <AccordionDetails>
                {d.body}
              </AccordionDetails>
            </Accordion>
        )
      }
    </div>
  );
}