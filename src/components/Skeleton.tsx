import { FunctionComponent } from 'react';

import styles from './Skeleton.module.css';

interface Props {
  type: 'list' | 'card';
  lines?: number;
  width?: 25 | 50 | 75 | 100;
  className?: string;
}

const Skeleton: FunctionComponent<Props> = ({ type, lines, width, className }) => {
  if (type === 'card') return <div className={`${styles.skeleton} ${styles[`skeleton-card-3`]} ${className}`} />;
  return (
    <div
      className={`${styles.skeleton} ${styles[`skeleton-${type}`]} ${className}`}
      style={{
        [`${'--lines'}`]: `${lines || 3}`,
        [`${'--c-w'}`]: `${width || 100}%`,
      }}
    />
  );
};

export default Skeleton;
