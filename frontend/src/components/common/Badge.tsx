import React, { ReactNode, HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
	return <span className="badge" {...props}>{children}</span>;
};

export default Badge;
