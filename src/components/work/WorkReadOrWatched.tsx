import { WorkDetail, WorkSumary } from '@/src/types/work';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState } from 'react';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Button from '@mui/material/Button';
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
import { Session } from '@/src/types';
// import styles from './WorkSummary.module.css';

interface Props {
  work: WorkDetail; //Work ID
  session: Session;
}

const years = (publicationYear:Date|null)=> {
   const max = dayjs().year();
   const yearsAgo = dayjs(dayjs()).diff(publicationYear||1993,'year');
   return [...Array(yearsAgo+1).keys()].map(y => `${max-y}`);
} 


const WorkReadOrWatched: FunctionComponent<Props> = ({ work,session }) => {
  const { t } = useTranslation('common');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

    const { mutate: execReadOrWatchedWork } = useExecReadOrWatchedWork({
      workId: work.id!,
    });


    const handleClickOpen = () => {
      setOpen(true);
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
            style={{
              width: '280px',
              background: 'var(--eureka-green)',
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
            }}
            variant="contained"
            size="small"
            startIcon={<RemoveRedEyeRoundedIcon />}
            onClick={handleClickOpen}
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
            style={{
              width: '280px',
              background: 'white',
              color: 'var(--eureka-green)',
              border: ' 1px solid var(--eureka-green)',
              fontFamily: 'Open Sans, sans-serif',
              textTransform: 'none',
            }}
            variant="contained"
            size="small"
            startIcon={
              <VisibilityOffRoundedIcon
                style={{
                  color: 'var(--eureka-green)',
                  fontFamily: 'Open Sans, sans-serif',
                  textTransform: 'none',
                }}
              />
            }
            onClick={handleDeleteReadOrWatched}
          >
            Desmarcar como visto o leído
          </Button>
        </>
      )}
    </>
  );
};

export default WorkReadOrWatched;
