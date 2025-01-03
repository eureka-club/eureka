
import React from "react";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionGroup from '@mui/material/Accordion'
import { Typography } from '@mui/material';
import { Grid, Box, } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';


const FAQ = () => {
  const { t } = useTranslation('spinardi');
  const [expanded, setExpanded] = React.useState<string|false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const data = [
    {
      id: "Panel 1",
      heading: t('acd title 1'),
      secondaryHeading: "",
      details: t('acd dates of Club 1')
    },
    {
      id: "Panel 2 ",
      heading: t('acd title 2'),
      secondaryHeading: "",
      details: t('acd dates of Club 2')
    },

    {
      id: "Panel 3 ",
      heading: t('acd title 3'),
      secondaryHeading: "",
      details: t('acd dates of Club 3')
    },
    {
      id: "Panel 4 ",
      heading: t('acd title 4'),
      secondaryHeading: "",
      details: t('acd dates of Club 4')
    },
    {
      id: "Panel 5 ",
      heading: t('acd title 5'),
      secondaryHeading: "",
      details: t('acd dates of Club 5')
    },
    {
      id: "Panel 6 ",
      heading: t('acd title 6'),
      secondaryHeading: "",
      details: t('acd dates of Club 6')
    },

    {
      id: "Panel 7 ",
      heading: t('acd title 7'),
      secondaryHeading: "",
      details: t('acd dates of Club 7')
    },

    {
      id: "Panel 8 ",
      heading: t('acd title 8'),
      secondaryHeading: "",
      details: t('acd dates of Club 8')
    },

    

  ];
 
 
  return (
    <>
    <div>
    <Grid item xs={12} sm={6}>
      <Box alignItems={"center"} justifyContent={"center"} >
        <Box maxWidth={800} alignItems={"center"} justifyContent={"center"} >
          {data.map(accordion => {
            const { id, heading, secondaryHeading, details } = accordion;
            return (

              <AccordionGroup elevation={3} 
                expanded={expanded === id}
                key={id}
                onChange={handleChange(id)}

              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"

                >
                  <Typography fontSize={16} >{heading}</Typography>
                  <Typography fontSize={16} >
                    {secondaryHeading}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color={'#7f8c8d'} fontSize={16}>{details}</Typography>
                </AccordionDetails>
              </AccordionGroup>

            );
          })}
        </Box>
      </Box>
    </Grid>
    </div>
    </>
  );
}
export default FAQ;