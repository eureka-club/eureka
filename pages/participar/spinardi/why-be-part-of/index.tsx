import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Grid, Box, Card, CardContent} from '@mui/material';

const WhyBePartOf = () => {
  return (
    <div>
      <Stack id="asUl" direction={{ xs: 'column',  sm: 'column'}}  justifyContent={'center'} alignItems={'center'} >
        <style jsx global>{
              `
                  #asUl{
                      padding:0;
                      counter-reset:my-counter;
                  }
                  #asUl .MuiGrid-item{
                      list-style:none;
                  }
                  #asUl .MuiGrid-item em:before{
                      counter-increment: my-counter;
                      padding:.5rem 1.2rem;
                      margin-right:.5rem;
                      content:counter(my-counter) ;
                      border:solid 1px var(--color-secondary);
                      background:var(--color-secondary);
                      color:white;
                      font-size:2rem;
                      border-radius:100%;
                  }
              `
              }
        </style>
        <Typography justifyContent={'center'} alignItems={'center'} paddingLeft={2} paddingTop={6} variant="h4" ><b> Como Funciona?</b></Typography>
        <Grid container justifyContent={'center'} alignItems={'center'}>
          <Box sx={{ 
              position:'absolute',
              zIndex:1,
              top:'0',
              right:'0',
              marginRight:0,
              marginTop:165,
                display:{xs:'none',lg:'block'}
            }}
          >
                <Image src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/imgctrx.webp`}
                    width={220}
                    height={195}
                />
          </Box>
          <Grid item xs={12} sm={12} paddingX={2}>
            <Card elevation={0} sx={{
              maxWidth:900, transition: "0.2s",
              "&:hover": {
                transform: "scale(1.03)"
              }
            }} >
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                  <Box  borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788", 
                                              
                                              borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                          }}>
                    <em></em>
                  </Box>
                  <Box>
                    <Typography paddingLeft={0} paddingX={2} variant="h5">Receba Recomendações Exclusivas sobre Amor</Typography>
                    <br></br>
                    <Typography  paddingLeft={0} paddingX={2} textAlign={"justify"} variant="body2"   fontSize={17}>
                    Todo mês, de março a junho de 2024, você receberá uma seleção cuidadosamente curada: um livro, dois filmes e duas músicas. Cada mês aborda um subtema relacionado ao amor: estereótipos do amor romântico (março), desafios do amor (abril), amores perdidos e não vividos (maio) e o futuro do amor (junho). As escolhas destacam uma diversidade de autoras e autores, e obras que inspiram, desafiam e ampliam horizontes.
                    </Typography>
                    
                  </Box>
                
                </Stack>
              </CardContent>

            </Card>
          </Grid>
        </Grid>

        <Grid container justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12} sm={12} padding={2}>
            <Card elevation={0} sx={{
              maxWidth:900, transition: "0.2s",
              "&:hover": {
                transform: "scale(1.03)"
              }
            }} >

              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                  <Box borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                             
                                             borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                         }}>
                    <em></em>

                  </Box>

                  <Box>
                    <Typography paddingLeft={0}  variant="h5">Experimente uma Jornada Guiada e com Tempo para Reflexão</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    Após receber as recomendações, é hora de mergulhar nas obras. Reserve um momento para si para ler o livro do mês, assistir aos filmes e ouvir as músicas. Você receberá resumos em texto e áudio, cronogramas personalizados e lembretes para organizar sua experiência. Cada detalhe foi pensado para integrar reflexão e aprendizado à sua rotina.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>

            </Card>
          </Grid>
          
        </Grid>

        <Grid container justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12} sm={12} padding={2}>
            <Card elevation={0} sx={{
             maxWidth:900,
               transition: "0.2s",
              "&:hover": {
                transform: "scale(1.03)"
              }
            }} >

              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                  <Box  borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                             
                                             borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                         }}>
                    <em></em>

                  </Box>

                  <Box>
                    <Typography paddingLeft={0}  variant="h5">Participe de Encontros Exclusivos com Spinardi</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    Ao final de cada mês, participe de encontros online para discutir as obras selecionadas, com a presença de Rafael Spinardi. Descubra novas perspectivas, compartilhe suas reflexões e surpreenda-se com as surpresas que estamos preparando especialmente para você.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>

            </Card>
          </Grid>
          
         
        </Grid>
        <Grid container justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12} sm={12} padding={2}>
            <Card elevation={0} sx={{
            maxWidth:900, transition: "0.2s",
              "&:hover": {
                transform: "scale(1.03)"
              }
            }} >

              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                  <Box  borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                             
                                             borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                         }}>
                    <em></em>

                  </Box>

                  <Box>
                    <Typography paddingLeft={0}  variant="h5">Explore Funcionalidades Exclusivas com IA</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    Descubra os 'Momentos Eureka': imagens geradas por inteligência artificial que transformam suas reflexões em experiências visuais únicas e inesquecíveis.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>

            </Card>
          </Grid>
          
         
        </Grid>        

    </Stack>
   
    </div>
  );
}
export default WhyBePartOf;