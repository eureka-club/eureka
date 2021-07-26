import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
// import { MySocialInfo } from '@/src/types';
// import { CycleDetail } from '../../types/cycle';
// import { PostDetail } from '../../types/post';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client';
import { WorkWithImages, WorkDetail } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
import { Session } from '../../types';

interface Props {
  // workWithImages: WorkWithImages;
  work: WorkDetail;
}
const MosaicItem: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');
  const { id, author, title, localImages, type } = work;
  const [session] = useSession() as [Session | null | undefined, boolean];
  // const [work, setWork] = useState<WorkDetail>();
  // const s
  // const { data: workData } = useQuery(['WORKS', id]);
  // useEffect(() => {
  //   if (workData) {
  //     setWork(workData as WorkDetail);
  //   }
  // }, [workData]);

  return (
    <Card className="text-center">
      <div className={styles.imageContainer}>
        <Link href={`/work/${id}`}>
          <a className="d-inline-block">
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        <span className={styles.type}>{t(type)}</span>
      </div>
      {session && (
        <Card.Footer className="text-muted">{work && <SocialInteraction showCounts entity={work} />}</Card.Footer>
      )}
    </Card>
    // <article className={styles.post}>
    //   <div className={styles.imageContainer}>
    //     <Link href={`/work/${id}`}>
    //       <a className="d-inline-block">
    //         <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
    //       </a>
    //     </Link>
    //     <span className={styles.type}>{t(type)}</span>
    //     {work && <SocialInteraction entity={work} />}
    //   </div>
    //   <Link href={`/work/${id}`}>
    //     <a className={styles.title}>{title}</a>
    //   </Link>
    //   <span className={styles.author}>{author}</span>
    // </article>
  );
};

export default MosaicItem;
