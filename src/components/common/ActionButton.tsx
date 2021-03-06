import classNames from 'classnames';
import { FunctionComponent, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useMutation } from 'react-query';
import { AiOutlineHeart, AiFillHeart, } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { FiShare2 } from 'react-icons/fi';

import styles from './ActionButton.module.css';


interface Props {
  level: any;
  level_name: string;
  currentActions: object;
  show_counts?: boolean;
}

const ActionButton: FunctionComponent<Props> = ({ 
  level,
  level_name,
  currentActions,
  show_counts=false,
}) => {
  const router = useRouter();
  const actions = [
    { name: 'like' , fill: AiFillHeart, outlined: AiOutlineHeart},
    { name: 'fav', fill: BsBookmarkFill, outlined: BsBookmark },
  ]
  const { 
    mutate: execAction,
    isLoading: isActionLoading,
    isSuccess: isActionSuccess,
  } = useMutation(
    async (params: object) => {
      await fetch(`/api/${level_name}/${level.id}/${params.action_name}/`, { method: params.method });
    },
  );

  const handleClick = (ev: MouseEvent<HTMLButtonElement>, action_name: string) => {
    ev.preventDefault();
    const method = currentActions[action_name] ? 'DELETE' : 'POST'
    execAction({method: method, action_name: action_name})
  };

  useEffect(() => {
    if (isActionSuccess)
      router.replace(router.asPath);
  }, [isActionSuccess]);


  return (

    <div className={styles['actions-container']}>
      { actions.map((action: object)=>{
        const Icon = action[(currentActions[action.name] ? 'fill' : 'outlined')];
        return  (
        <span className={ classNames(styles['actions-container'], styles[`action-${action.name}`])}>
          <Button 
            variant="link-secondary"
            onClick={(e)=> handleClick(e, action.name) }
            className={styles[`actions`]}
           >
            <Icon /> 
          </Button>
          {show_counts && 
            <span>
              {level[`${action.name}s`].length}
            </span>
          }
        </span>)
      }) }
      {false && <span>
        <FiShare2 className={styles['actions']} />
      </span>}
  </div>



  );
};

export default ActionButton;
