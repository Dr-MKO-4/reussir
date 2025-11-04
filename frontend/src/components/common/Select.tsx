import React, { SelectHTMLAttributes } from 'react';

interface Option {
	value: string | number;
	label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	options: Option[];
}

const Select: React.FC<SelectProps> = ({ options, ...props }) => {
	return (
		<select className="select" {...props}>
			{options && options.map((opt, i) => (
				<option key={i} value={opt.value}>{opt.label}</option>
			))}
		</select>
	);
};

export default Select;
