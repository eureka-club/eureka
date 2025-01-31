
import React from "react";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionGroup from '@mui/material/Accordion'
import { Typography } from '@mui/material';
import { Grid, Box, } from '@mui/material';
import Trans from "next-translate/Trans";


const FAQ = () => {
  const [expanded, setExpanded] = React.useState<string|false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const data = [
    {
      id: "Panel 1",
      heading: "Quanto tempo dura o Clube? ",
      secondaryHeading: "",
      details: "Este Clube acontecerá de março a junho de 2025, com encontros mensais e discussões contínuas."
    },
    {
      id: "Panel 2 ",
      heading: "Os livros recomendados estão disponíveis em português?",
      secondaryHeading: "",
      details: "Sim, todas as nossas recomendações de livros estão disponíveis em português, garantindo que todes possam participar das leituras e discussões."
    },
    {
      id: "Panel 3 ",
      heading: "Como faço para acessar os livros e filmes do clube?",
      secondaryHeading: "",
      details: "Recomendamos onde encontrar as obras selecionadas, mas cada pessoa é responsável por acessar e/ou comprar cada uma."
    },
    {
      id: "Panel 4 ",
      heading: "É necessário ter conhecimento prévio sobre o tema?",
      secondaryHeading: "",
      details: "Não é necessário ter conhecimento prévio. Nosso clube é aberto a qualquer pessoa deseja aprender e explorar estes temas, independentemente do seu nível de familiaridade com eles."
    },
    {
      id: "Panel 5 ",
      heading: "Quanto tempo devo dedicar à leitura e às discussões?",
      secondaryHeading: "",
      details: "Você pode dedicar o tempo que achar necessário. Nosso clube é flexível, permitindo que você participe conforme sua disponibilidade e ritmo de leitura. Para te ajudar a te organizar, todo mês compartilharemos um cronograma de leitura, resumos em texto e áudio, e materiais de acompanhamento."
    },
    {
      id: "Panel 6 ",
      heading: "Vou conhecer os criadores do Clube? Os encontros são online ou presenciais?",
      secondaryHeading: "",
      details: "Sim! Você poderá interagir com os criadores do Clube durante encontros virtuais ao vivo e, em alguns casos, presenciais em São Paulo."
    },
    {
      id: "Panel 7 ",
      heading: "Como posso acessar a comunidade e o fórum online?",
      secondaryHeading: "",
      details: "Após se inscrever no clube, você receberá um link por email para acessar nossa comunidade online. Lá, você poderá participar das discussões e interagir com outros membros."
    },
    {
      id: "Panel 8 ",
      heading: "Como posso entrar em contato para mais informações?",
      secondaryHeading: "",
      details: "Estamos disponíveis para ajudar! Entre em contato pelo e-mail hola@eureka.club e nossa equipe responderá rapidamente."
    },
    {
      id:"Panel 9",
      heading:"Não consegue pagar o valor total?",
      secondaryHeading:"",
      details:"Nós podemos ajudar! 🎓 Você pode se candidatar para uma bolsa. Escreva para hola@eureka.club e solicite o formulário de candidatura."
    }
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