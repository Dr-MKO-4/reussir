import React from 'react';
import styles from './BackgroundAnimation.module.css';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.floatingShapes}>
        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
        <div className={`${styles.shape} ${styles.shape4}`} />
      </div>
      <div className={styles.gradientOverlay} />
    </div>
  );
};

export default BackgroundAnimation;