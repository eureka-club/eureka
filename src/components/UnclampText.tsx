// import classNames from 'classnames';
// import useTranslation from 'next-translate/useTranslation';
import { 
  // FunctionComponent, MouseEvent, useEffect, useRef, 
  useState 
} from 'react';
// import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

// import styles from './UnclampText.module.css';
import { Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi';

interface Props {
  // clampHeight?: string;
  text: string;
  // showButtomMore?: boolean;
  isHTML?: boolean;
}
const UnclampText = ({text,isHTML}:Props)=>{
  const [textIsUnclamped, setTextIsUnclamped] = useState(false);

  const sx={height:'10rem',overflowX:'hidden'}
  return <Stack>
    {
      isHTML
        ? <Box  id="uct" sx={sx} dangerouslySetInnerHTML={{ __html: text }} />
        : <Typography  id="uct" sx={sx}>{text}</Typography>
    }
    <Box>
      <Button variant='outlined' size='small' onClick={()=>{
        const val = !textIsUnclamped;
        setTextIsUnclamped(p=>val);
        const t:HTMLDivElement = document.querySelector('#uct')!;

        if(!val){
          t.setAttribute('style','height:10rem')
        }
        else
        t.setAttribute('style','height:auto')
      }}>
        {
          textIsUnclamped 
            ? <BiArrowToTop fontSize='1.2rem'/>
            : <BiArrowToBottom fontSize='1.2rem'/>
        }
      </Button>
    </Box>
</Stack>
}
// const UnclampText: FunctionComponent<Props> = ({ clampHeight, text, showButtomMore = true, isHTML = true }) => {
//   // const textRows = text.split('\n').filter((row) => row.length);

//   const outerRef = useRef<HTMLDivElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);
//   const [textIsUnclamped, setTextIsUnclamped] = useState(false);
//   const [unclampButtonVisible, setUnclampButtonVisible] = useState(false);
//   const { t } = useTranslation('common');

//   const handleExpandContentTextClick = (ev: MouseEvent) => {
//     ev.preventDefault();

//     if (outerRef?.current != null) {
//       setTextIsUnclamped(!textIsUnclamped);
//     }
//   };

//   useEffect(() => {
//     if (isHTML) {
//       if (innerRef?.current != null && innerRef.current.innerText && innerRef.current.innerText.length > 100) {
//         setUnclampButtonVisible(true);
//       }
//     } else if (innerRef?.current?.offsetHeight != null && outerRef?.current?.offsetHeight != null) {
//       if (innerRef.current.offsetHeight > outerRef.current.offsetHeight) {
//         setUnclampButtonVisible(true);
//       }
//     }
//   }, [outerRef.current?.offsetHeight, innerRef?.current?.offsetHeight, isHTML]);

//   return (
//     <>
//       <div
//         ref={outerRef}
//         // className={classNames(styles.outer, { [styles.contentTextUnclamped]: textIsUnclamped })}
//         className={`${unclampButtonVisible ? styles.outer : ''} ${textIsUnclamped ? styles.contentTextUnclamped : ''}`}
//         style={{ height: textIsUnclamped ? 'auto' : clampHeight }}
//       >
//         {/* <div ref={innerRef}>
//           {textRows.map((row, idx) => (
//             <p key={`${idx + 1}${row[0]}${row[1]}-${row.length}`}>{row}</p>
//           ))}
//         </div> */}
//         <div ref={innerRef} className="" dangerouslySetInnerHTML={{ __html: text }} />
//       </div>

//       {showButtomMore && unclampButtonVisible && (
//         <Button variant="link" onClick={handleExpandContentTextClick} className={styles.unclampButton}>
//           {textIsUnclamped === true ? (
//             <>
//               {t('unclampTextLess')} <BsChevronUp />
//             </>
//           ) : (
//             <>
//               {t('unclampTextMore')} <BsChevronDown />
//             </>
//           )}
//         </Button>
//       )}
//     </>
//   );
// };

export default UnclampText;
