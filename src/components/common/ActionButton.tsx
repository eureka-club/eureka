import classNames from 'classnames';
import { FunctionComponent, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useMutation } from 'react-query';
import { AiOutlineHeart, AiFillHeart, } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

import styles from './ActionButton.module.css';


interface Props {
  level: any;
  level_name: string;
  action: string;
  currentActions: object;
  show_counts?: boolean;
}

const ActionButton: FunctionComponent<Props> = ({ 
  level,
  level_name,
  action,
  currentActions,
  show_counts=false,
}) => {
  const router = useRouter();
  const actions = [
    { name: 'like' , fill: AiFillHeart, outlined: AiOutlineHeart},
    { name: 'fav', fill: BsBookmarkFill, outlined: BsBookmark },
  ]

  const components = {
      one: AiOutlineHeart,
      two: AiFillHeart
  };

  const action_obj = actions.find(x=>x.name == action)
  
  const Icon = action_obj[(currentActions[action] ? 'fill' : 'outlined')];

  const { 
    mutate: execAction,
    isLoading: isActionLoading,
    isSuccess: isActionSuccess,
  } = useMutation(
    async (method: string) => {
      //await fetch(`/api/cycle/${cycle.id}/like`, { method: method });
      await fetch(`/api/${level_name}/${level.id}/${action}/`, { method: method });
    },
  );

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execAction(currentActions[action] ? 'DELETE' : 'POST')
  };

  useEffect(() => {
    if (isActionSuccess)
      router.replace(router.asPath);
  }, [isActionSuccess]);


  return (
    <span>
      <Button 
        variant="link-secondary"
        onClick={ handleClick }
        className={styles.actions}
       >
        <Icon className={styles[`action-${action}`]} /> 
      </Button>
      {show_counts && <span>{level[`${action}s`].length}</span>}
    </span>
  );
};

export default ActionButton;
