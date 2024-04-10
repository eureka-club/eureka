import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AccordionGroup from '@mui/material/Accordion'
import { root } from "postcss";
import { Box, Grid } from "@mui/material";
import useTranslation from "next-translate/useTranslation";


export default function Acordion() {
  const{t}=useTranslation('about');
  const [expanded, setExpanded] = React.useState<string|false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const data = [
    {
      id: "Panel 1",
      heading: t('lbl15H'),
      secondaryHeading: "",
      details: t('lbl15B')
    },
    {
      id: "Panel 2 ",
      heading: t('lbl16H'),
      secondaryHeading: "",
      details: t('lbl16B')
    },

    {
      id: "Panel 3 ",
      heading: t('lbl17H'),
      secondaryHeading: "",
      details: t('lbl17B')
    },
    {
      id: "Panel 4 ",
      heading: t('lbl18H'),
      secondaryHeading: "",
      details: t('lbl18B')
    },
    {
      id: "Panel 5 ",
      heading: t('lbl19H'),
      secondaryHeading: "",
      details: t('lbl19B')
    },
    {
      id: "Panel 6 ",
      heading: t('lbl20H'),
      secondaryHeading: "",
      details: t('lbl20B')
    },

    {
      id: "Panel 7 ",
      heading: t('lbl21H'),
      secondaryHeading: "",
      details: t('lbl21B')
    },

    {
      id: "Panel 8 ",
      heading: t('lbl22H'),
      secondaryHeading: "",
      details: t('lbl22B')
    },

    {
      id: "Panel 9 ",
      heading: t('lbl23H'),
      secondaryHeading: "",
      details: t('lbl23B')
    },

    {
      id: "Panel 10 ",
      heading: t('lbl24H'),
      secondaryHeading: "",
      details: t('lbl24B')
    },

    {
      id: "Panel 11 ",
      heading: t('lbl25H'),
      secondaryHeading: "",
      details: t('lbl25B')
    },

    {
      id: "Panel 12 ",
      heading: t('lbl26H'),
      secondaryHeading: "",
      details: t('lbl26B')
    },

    {
      id: "Panel 13 ",
      heading: t('lbl27H'),
      secondaryHeading: "",
      details: t('lbl27B')
    },

  ];

  return (
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
  );
}
