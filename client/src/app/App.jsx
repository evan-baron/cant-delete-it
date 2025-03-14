// External Libraries
import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import './app.scss';

// Context
import { useAppContext } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
import PasswordReset from '../pages/PasswordReset/PasswordReset.jsx';

// Components
import Navbar from '../components/Navbar/Navbar.jsx';

const App = () => {
	const { user } = useAppContext();

	return (
		<div className='app'>
			<div className='container'>
				<header>
					{user && <Navbar />}
				</header>
				<main>
					<Routes>
						<Route path='/' element={<Home to='/' />} />
						<Route
							path='/reset-password'
							element={user ? <Navigate to='/' /> : <PasswordReset />}
						/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default App;
