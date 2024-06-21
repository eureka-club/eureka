import { useModalContext } from "@/src/hooks/useModal";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC, MouseEvent } from "react";
import SignInForm from "../../forms/SignInForm";
import { isWorkMosaicItem } from "@/src/types";
import { Button, IconButton, Typography } from "@mui/material";
import { BiImageAdd } from "react-icons/bi";

interface RenderCreateEurekaProps{
    work:any;
    showCreateEureka:boolean;
    loadingSocialInteraction:boolean;
  }
  export const RenderCreateEureka:FC<RenderCreateEurekaProps> = ({work,showCreateEureka,loadingSocialInteraction}) => {
    const { t } = useTranslation('common');
    const { data: session, status } = useSession();
    const { show } = useModalContext();
    const router=useRouter();
  
    const isLoadingSession = status === 'loading';
  
    const openSignInModal = () => {
      // setQty(0);
      show(<SignInForm />);
    };
  
    const canNavigate = () => {
      return !(!work || isLoadingSession);
    };
  
    const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      if (!session) {
        openSignInModal();
        return null;
      }
      if (canNavigate()) {
        router.push({ pathname: `/work/${work.id}`, query: { tabKey: 'posts' } });
      }
    };
  
    if (!work || isLoadingSession) return <>{`...`}</>;
    if (showCreateEureka)
      return (
        <>
          {/* <Button
            // className={`${styles.buttonSI} p-0 text-primary`}
            title={t('Create eureka')}
            onClick={handleCreateEurekaClick}
            disabled={loadingSocialInteraction}
          >
            <div className={`d-flex flex-row`}>
              <BiImageAdd 
              />
              <span className="d-flex align-items-center text-primary" style={{ fontSize: '0.8em' }}>
                {t('Create eureka')}
              </span>
            </div>
          </Button> */}
          <IconButton size="small" color="primary"
            title={t('Create eureka')}
            onClick={handleCreateEurekaClick}
            disabled={loadingSocialInteraction}
          >
            <BiImageAdd /> <Typography variant="caption" color={'primary'}>{t('Create eureka')}</Typography>
          </IconButton>
          {/*isLoadingCreateEureka  && <div className='d-flex align-items-center' ><Spinner  /></div> */}
        </>
      );
    return <></>;
  };
  