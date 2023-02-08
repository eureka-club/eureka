import { FunctionComponent } from 'react';
import{Button} from 'react-bootstrap'
import useHyvorComments from '@/src/useHyvorComments';
import styles from './WorkComments.module.css';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';


interface Props {
  workId: number;
  //workTitle: string;
}

const WorkComments: FunctionComponent<Props> = ({ workId }) => {
  const { data: comments } = useHyvorComments(`work-${workId}`);
  const router = useRouter();


  const styleObj = {
    'margin-left': '2rem',
  };

  const getTime = (timestamp: number): string => {

    let date = dayjs(timestamp*1000).format('ddd, MMM DD, YYYY h:mm a');
    return date;
    
  };

  if (comments && comments.length) {
    return (
      <>
        <h3 className="text-secondary mt-3 fs-5 mb-2">{'Comentarios de nuestres usuaries'}</h3>
        <section className={`mb-3 ${styles.commentsSection}`}>
          {comments?.map((e, index) => (
            <section key={index} className="d-flex flex-row ps-3 py-2">
              <img
                className={`${styles.avatar}`}
                src={e.user.picture || '/img/default-avatar.png'}
                alt={e.user.name || ''}
              />
              <div
                className={`d-flex flex-column ${styles.comments}`}
                dangerouslySetInnerHTML={{
                  __html:
                    "<div class='d-flex flex-wrap ps-1' style='font-size: 1rem'><b>" +
                    e.user.name +
                    `</b><div class='ps-2 d-flex align-items-center' style="font-size: 0.75rem;color:#a1a3a9" >${getTime(
                      e.created_at,
                    )}</div>` +
                    "</div><div class='d-flex flex-wrap ps-1'>" +
                    e.body +
                    '</div>',
                }}
              ></div>
            </section>
          ))}
        </section>
        <section className="mb-3 d-flex justify-content-center ">
          <Button className="btn-eureka" onClick={() => router.push(`work/${workId}`)}>
            Participa
          </Button>
        </section>
      </>
    );
  } else return <></>;
};
export default WorkComments;
