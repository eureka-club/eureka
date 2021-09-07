import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import styles from './UnclampText.module.css';

interface Props {
  clampHeight: string;
  text: string;
  showButtomMore?: boolean;
}

const UnclampText: FunctionComponent<Props> = ({ clampHeight, text, showButtomMore = true }) => {
  const textRows = text.split('\n').filter((row) => row.length);

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [textIsUnclamped, setTextIsUnclamped] = useState(false);
  const [unclampButtonVisible, setUnclampButtonVisible] = useState(false);
  const { t } = useTranslation('common');

  const handleExpandContentTextClick = (ev: MouseEvent) => {
    ev.preventDefault();

    if (outerRef?.current != null) {
      setTextIsUnclamped(!textIsUnclamped);
    }
  };

  useEffect(() => {
    if (innerRef?.current != null && innerRef.current.innerText && innerRef.current.innerText.length > 100) {
      setUnclampButtonVisible(true);
    }
    // if (innerRef?.current?.offsetHeight != null && outerRef?.current?.offsetHeight != null) {
    //   if (innerRef.current.offsetHeight > outerRef.current.offsetHeight) {
    //     setUnclampButtonVisible(true);
    //   }
    // }
  }, [outerRef, innerRef]);

  return (
    <>
      <div
        ref={outerRef}
        className={classNames(styles.outer, { [styles.contentTextUnclamped]: textIsUnclamped })}
        style={{ height: textIsUnclamped ? 'auto' : clampHeight }}
      >
        <div ref={innerRef}>
          {textRows.map((row, idx) => (
            <p key={`${idx + 1}${row[0]}${row[1]}-${row.length}`}>{row}</p>
          ))}
        </div>
      </div>

      {showButtomMore && unclampButtonVisible && (
        <Button variant="link" onClick={handleExpandContentTextClick} className={styles.unclampButton}>
          {textIsUnclamped === true ? (
            <>
              {t('unclampTextLess')} <BsChevronUp />
            </>
          ) : (
            <>
              {t('unclampTextMore')} <BsChevronDown />
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default UnclampText;
