import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	fullWidth?: boolean;
	icon?: ReactNode;
	children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	loading = false,
	disabled = false,
	fullWidth = false,
	icon = null,
	children,
	className = '',
	...props
}) => {
	const buttonClasses = [
		'btn',
		`btn-${variant}`,
		`btn-${size}`,
		fullWidth && 'btn-full-width',
		loading && 'btn-loading',
		className
	].filter(Boolean).join(' ');

	return (
		<button
			className={buttonClasses}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<span className="btn-spinner">
					<span className="spinner-ring"></span>
				</span>
			)}
			{!loading && icon && (
				<span className="btn-icon">{icon}</span>
			)}
			{children && (
				<span className="btn-text">{children}</span>
			)}
		</button>
	);
};

export default Button;
