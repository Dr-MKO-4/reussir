import React, { InputHTMLAttributes } from 'react';

const SearchBar: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
	return <input className="search-bar" type="search" placeholder="Rechercher..." {...props} />;
};

export default SearchBar;
