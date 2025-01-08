import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import Countdown from 'pages/participar/components/Countdown';

import Image from 'next/image';
import { Container } from '@mui/system';
import { Grid, Box, Card, CardContent, CardHeader,Avatar, IconButton, Divider} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';


 

const WhyBePartOf = () => {
 
    const { t } = useTranslation('spinardi');
  return (
    <div>
     
      <Stack id="asUl" direction={{ xs: 'column',  sm: 'column'}} gap={2} justifyContent={'center'} alignItems={'center'} >
     
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
        
        <Typography justifyContent={'center'} alignItems={'center'} paddingLeft={2} paddingTop={6} variant="h4" ><b> {t('title question')}</b></Typography>
        
        <Grid container justifyContent={'center'} alignItems={'center'}>

        <Box sx={{ 
                      position:'absolute',
                      zIndex:1,
                      top:'0',
                      right:'0',
                      marginRight:0,
                      marginTop:165,
                        display:{xs:'none',lg:'block'}
                    }}>
                        <Image src='/img/imgctrx.webp'
                            width={220}
                            height={220}
                        />
                    </Box>
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

                  <Box   >
                    <Typography paddingLeft={0} paddingX={2} variant="h5">{t('lbl1H')}</Typography>
                    <br></br>
                    <Typography  paddingLeft={0} paddingX={2} textAlign={"justify"} variant="body2"   fontSize={17}>
                    {t('lbl1B')}
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
                    <Typography paddingLeft={0}  variant="h5">{t('lbl2H')}</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    {t('lbl2B')}
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
                    <Typography paddingLeft={0}  variant="h5">{t('lbl3H')}</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    {t('lbl3B')}
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
                    <Typography paddingLeft={0}  variant="h5">{t('lbl4H')}</Typography>
                    <br></br>
                    <Typography paddingLeft={0} textAlign={"justify"} variant="body2"  fontSize={17}>
                    {t('lbl4B')}
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