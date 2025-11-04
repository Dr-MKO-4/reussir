import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, ...props }) => {
	return <div className="card" {...props}>{children}</div>;
};

export default Card;
