import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded';
  status?: 'online' | 'offline' | 'away';
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials = '?',
  size = 'md',
  variant = 'circle',
  status,
  onClick,
}) => {
  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${styles[variant]}`}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className={styles.placeholder}>{initials}</div>
      )}
      {status && <span className={`${styles.status} ${styles[status]}`} />}
    </div>
  );
};

export default Avatar;
