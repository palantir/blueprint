import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: number;
  height?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = 20, height = 13 }) => {
  return (
    <span
      className={styles.skeleton}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};
