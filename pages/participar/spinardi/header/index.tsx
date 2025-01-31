import { Button, Stack, Typography } from '@mui/material';
import { Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <Box sx={{backgroundColor: "#ecf0f1",paddingTop:{xs:0,md:6, sm:6,lg:6}, gap:{xs:0}}}>
      <Stack gap={0} paddingTop={0} paddingBottom={0} paddingLeft={2} sx={{display: { xs: 'none', lg: 'block', sm: 'block', md: 'block',paddingTop:{xs:0}, gap:{xs:0}}}}>
        <aside className="d-flex  align-items-left aligg-content-left">
          <Image priority={true} src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/logo.svg`} width={45} height={52} alt="EUREKA" />
          <section>
            <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
            <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>
            Tecnologia + cultura, pela justiça social
            </p>
          </section>
        </aside>
      </Stack>
      <Stack gap={2} paddingTop={0} paddingBottom={0}>
        <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Stack direction={{xs:'column',md:'row'}} paddingX={2} alignItems={'flex-end'}>
                <Box sx={{
                  width:{xs:'100%',md:'30%'}
                }}>
                  <Image src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/muchachoh.webp`} width={371} height={291}/>
                </Box>
                <Box sx={{
                  width:{xs:'100%',md:'40%'}
                }}>
                    <Typography textAlign="center" paddingTop={2} variant="h4">
                        <b>Com amor, Spinardi</b>
                      </Typography>

                      <Typography paddingBlockEnd={1} textAlign="center" fontSize={20} paddingTop={2}>
                        <b>Um Clube de Leitura, Cinema e Música para para viver, refletir e celebrar o amor através da arte.</b>
                      </Typography>
                      <Typography textAlign="center" variant="subtitle1">
                        Durante 4 meses, de março a junho, você terá acesso a uma <b>curadoria especial de livros, filmes e músicas e encontros (presenciais e virtuais) com o Spinardi.</b>
                      </Typography>
                      <Box paddingBottom={6} paddingRight={2} sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }}>
                        <Typography paddingBlockStart={0} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <Link href="#price-info">
                            <Button variant='contained'>INSCREVA-SE NO CLUBE</Button>
                          </Link>
                        </Typography>
                        <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <i>Amar pode custar caro, mas refletir sobre o amor nunca foi tão acessível.</i>
                        </Typography>
                      </Box>
                    </Box>
                <Box 
                  sx={{
                    width:{xs:'100%',md:'30%'},
                    display:{md:'inherit',xs:'none'}
                  }}>
                  <Image priority={true} src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/libros.webp`} width={371} height={350}/>
                </Box>
              </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
export default Header;
