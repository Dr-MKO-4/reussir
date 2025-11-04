import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(prev => !prev);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<div className="main-layout">
			{/* Header */}
			<Header 
				onMenuClick={toggleSidebar}
				sidebarOpen={sidebarOpen}
			/>

			{/* Overlay pour mobile */}
			{sidebarOpen && (
				<div 
					className="sidebar-overlay"
					onClick={closeSidebar}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<Sidebar 
				isOpen={sidebarOpen}
				onClose={closeSidebar}
			/>

			{/* Main content */}
			<main className="main-content">
				<div className="content-wrapper">
					<Outlet />
				</div>
				{/* Footer */}
				<Footer />
			</main>
		</div>
	);
};

export default MainLayout;
