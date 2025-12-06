import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1em',
  count = 1,
  className = '',
}) => {
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{
        width: widthValue,
        height: heightValue,
      }}
    />
  ));

  return count === 1 ? skeletons[0] : <div className={styles.container}>{skeletons}</div>;
};

export default Skeleton;
