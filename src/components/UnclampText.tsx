"use client"
import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import styles from './UnclampText.module.css';
import { useDictContext } from '../hooks/useDictContext';
import { t } from '../get-dictionary';

interface Props {
  clampHeight?: string;
  text: string;
  showButtomMore?: boolean;
  isHTML?: boolean;
}

const UnclampText: FunctionComponent<Props> = ({ clampHeight, text, showButtomMore = true, isHTML = true }) => {

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [textIsUnclamped, setTextIsUnclamped] = useState(false);
  const [unclampButtonVisible, setUnclampButtonVisible] = useState(false);
  // const { t } = useTranslation('common');
  const {dict}=useDictContext();

  const handleExpandContentTextClick = (ev: MouseEvent) => {
    ev.preventDefault();

    if (outerRef?.current != null) {
      setTextIsUnclamped(!textIsUnclamped);
    }
  };

  useEffect(() => {
    if (isHTML) {
      if (innerRef?.current != null && innerRef.current.innerText && innerRef.current.innerText.length > 100) {
        setUnclampButtonVisible(true);
      }
    } else if (innerRef?.current?.offsetHeight != null && outerRef?.current?.offsetHeight != null) {
      if (innerRef.current.offsetHeight > outerRef.current.offsetHeight) {
        setUnclampButtonVisible(true);
      }
    }
  }, [outerRef.current?.offsetHeight, innerRef?.current?.offsetHeight, isHTML]);

  return (
    <>
      <div
        ref={outerRef}
        className={`${unclampButtonVisible ? styles.outer : ''} ${textIsUnclamped ? styles.contentTextUnclamped : ''}`}
        style={{ height: textIsUnclamped ? 'auto' : clampHeight }}
      >
        <div ref={innerRef} className="" dangerouslySetInnerHTML={{ __html: text }} />
      </div>

      {showButtomMore && unclampButtonVisible && (
        <Button variant="link" onClick={handleExpandContentTextClick} className={styles.unclampButton}>
          {textIsUnclamped === true ? (
            <>
              {t(dict,'unclampTextLess')} <BsChevronUp />
            </>
          ) : (
            <>
              {t(dict,'unclampTextMore')} <BsChevronDown />
            </>
          )}
        </Button>
      )}
    </>
  );
};

export default UnclampText;
