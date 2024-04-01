import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AccordionGroup from '@mui/material/Accordion'
import { root } from "postcss";
import { Box, Grid } from "@mui/material";


export default function Acordionc() {

  const [expanded, setExpanded] = React.useState<string|false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  

  const data = [
    {
      id: "Panel 1",
      heading: "¿El acceso a Eureka es gratuito?",
      secondaryHeading: "",
      details: "El acceso a Eureka y la participación en muchos de nuestros Clubs de Lectura y Cine son gratuitos. Ofrecemos una amplia variedad de Clubs, incluyendo algunos que son de pago, los cuales proveen experiencias adicionales y contenidos exclusivos."
    },
    {
      id: "Panel 2 ",
      heading: "¿Cómo funcionan los Clubs de Lectura y Cine de Eureka?",
      secondaryHeading: "",
      details: "Un Club de Lectura y Cine en Eureka es una experiencia colectiva donde exploramos un tema de actualidad a través de libros y películas seleccionados. Incluye encuentros mensuales virtuales, discusiones asincrónicas y mucho más para enriquecer tu conocimiento y contribuir al cambio social."
    },

    {
      id: "Panel 3 ",
      heading: "¿Eureka proporciona acceso gratuito a los libros y películas recomendados?",
      secondaryHeading: "",
      details: "Siempre que es posible, ofrecemos acceso a películas a través de colaboraciones especiales y cuando el contenido es de dominio público. Sin embargo, no proporcionamos libros o películas gratuitos regularmente. Facilitamos recomendaciones sobre dónde puedes encontrar los libros y películas seleccionados para que cada persona de nuestra comunidad busque acceder a ellos por sus propios medios."
    },
    {
      id: "Panel 4 ",
      heading: "¿Cómo se seleccionan los libros y películas para cada Club de Lectura y Cine?",
      secondaryHeading: "",
      details: "Los contenidos son cuidadosamente seleccionados por nuestro equipo multidisciplinario para garantizar una rica experiencia de aprendizaje. Buscamos obras que sean relevantes para los temas contemporáneos y aprovechamos para darle visibilidad a obras de autoría latinoamericana, y/o grupos históricamente marginalizados."
    },
    {
      id: "Panel 5 ",
      heading: "¿Es necesario tener conocimientos previos antes de unirse a un Club de Lectura y Cine?",
      secondaryHeading: "",
      details: "No, no es necesario tener conocimientos previos sobre los temas que tratamos, como feminismo y tecnología. Eureka acoge tanto a personas principiantes como expertas, proporcionando un espacio inclusivo para aprender, compartir y expandir tus horizontes en cualquier área de interés."
    },
    {
      id: "Panel 6 ",
      heading: "¿Qué es un 'Momentos Eureka' y porque se hace con inteligencia artificial?",
      secondaryHeading: "",
      details: "Un 'Momento Eureka' es tu reflexión personal trás leer un libro o ver una película. Decimos que es una revelación individual que puede ayudar a transformar el entendimiento colectivo.  Inspirada por metodologías de educación popular, Eureka te permite crear una imagen con la ayuda de inteligencia artificial para ilustrar y compartir tu ‘Momento Eureka’."
    },

    {
      id: "Panel 7 ",
      heading: "¿Cómo puedo llevar un registro de los libros y películas que he leído y visto?",
      secondaryHeading: "",
      details: "Puedes organizar fácilmente los libros y películas que has leído o visto cada año con nuestra función “Mis libros y películas”. Para agregarlos a esta lista anual, simplemente haz clic en “Agregar a mi lista” en la página de la obra y selecciona el año en que la leíste o viste."
    },

    {
      id: "Panel 8 ",
      heading: "¿Qué son los resúmenes de audio en Eureka?",
      secondaryHeading: "",
      details: "Los resúmenes de audio que ofrecemos en Eureka son versiones condensadas de libros, las cuales te ayudan a captar las ideas principales de las obras destacadas en solo 15-20 minutos."
    },

    {
      id: "Panel 9 ",
      heading: "¿Eureka organiza encuentros en línea o presenciales?",
      secondaryHeading: "",
      details: "Actualmente, nuestras actividades son todas en línea, pero estamos abiertas a organizar encuentros presenciales en el futuro, dependiendo del interés y la disponibilidad de personas que participan en el Club."
    },

    {
      id: "Panel 10 ",
      heading: "¿Qué es mi Mediateca?",
      secondaryHeading: "",
      details: "Tu Mediateca es un espacio personal donde se reúnen tus contribuciones y descubrimientos. Aquí encuentras tus 'Momentos Eureka', los Clubes en los que has participado, y un registro de los libros y películas que has explorado o guardado para luego. También es el lugar para compartir sobre ti y seguir a otros miembros de la comunidad."
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
