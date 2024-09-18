import { WorkDetail, WorkSumary } from '@/src/types/work';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState } from 'react';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';
import useExecReadOrWatchedWork from '@/src/hooks/mutations/useExecReadOrWatchedWork';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../forms/SignInForm';
import { Typography } from '@mui/material';
// import styles from './WorkSummary.module.css';

interface Props  extends ButtonProps{
  work: WorkDetail; //Work ID
}

const years = (publicationYear:Date|null)=> {
   const max = dayjs().year();
   const yearsAgo = dayjs(dayjs()).diff(publicationYear||1993,'year');
   return [...Array(yearsAgo+1).keys()].map(y => `${max-y}`);
} 


const WorkReadOrWatched: FunctionComponent<Props> = ({ work, ...others }) => {
  const { t } = useTranslation('common');
  const{data:session}=useSession();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const{show}=useModalContext();
    const { mutate: execReadOrWatchedWork } = useExecReadOrWatchedWork({
      workId: work.id!,
    });


    const handleClickOpen = () => {
      if(session?.user)
        setOpen(true);
      else
        show(<SignInForm/>);
    };

    const handleClose = () => {
      setOpen(false);
    };

     const handleListItemClick = (value: string) => {
       setValue(value);
        setOpen(false);
       execReadOrWatchedWork({
         year: parseInt(value),
         doCreate: value.length ? true : false,
       });      

     };

      const handleDeleteReadOrWatched = () => {
        execReadOrWatchedWork({
          year: 0,
          doCreate: false,
        });
      };

     const isReadOrWatched = () => {
       if (session && work) {
         let ReadOrWatched = work.readOrWatchedWorks.filter(
           (i) => i.workId == work.id && i.userId == session.user.id,
         );
         if (ReadOrWatched.length) return true;
         else return false;
       }
       return false;
     };


  return (
    <>
      {!isReadOrWatched() && (
        <>
          <Button
            variant='outlined'
            size="small"
            startIcon={<RemoveRedEyeRoundedIcon />}
            onClick={handleClickOpen}
            {...others}
            style={{
              justifyContent:'flex-start'
            }}
          >
            {t('readOrWatchedLbl')}
          </Button>
          <Dialog open={open} onClose={handleClose} scroll="paper">
            <DialogTitle
              style={{
                fontSize: '1em',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Especifique año de visto o leído
            </DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <List sx={{ pt: 0, mt: 0 }} className="h-50">
                {years(work.publicationYear).map((year) => (
                  <ListItem disablePadding key={year}>
                    <ListItemButton onClick={() => handleListItemClick(year)}>
                      <ListItemText
                        className="d-flex justify-content-center"
                        disableTypography
                        primary={year}
                        sx={{
                          fontSize: '1em',
                          fontFamily: 'Open Sans, sans-serif',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                style={{
                  background: 'var(--eureka-green)',
                  fontFamily: 'Open Sans, sans-serif',
                  textTransform: 'none',
                  fontSize: '1em',
                }}
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {isReadOrWatched() && (
        <>
          <Button
            variant="contained"
            size="small"
            startIcon={
              <VisibilityOffRoundedIcon/>
            }
            onClick={handleDeleteReadOrWatched}
            {...others}
          >
            <Typography variant='body2'>
             {t('readOrWatchedSelect')}
            </Typography>
          </Button>
        </>
      )}
    </>
  );
};

export default WorkReadOrWatched;
