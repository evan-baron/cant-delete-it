import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import './app.scss';

// Context
import { ContextProvider } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
import PasswordReset from '../pages/PasswordReset/PasswordReset.jsx';

// Components
// import Navbar from '../components/Navbar.jsx';

const App = () => {
	const { user } = ContextProvider;

	return (
		<BrowserRouter>
			<ContextProvider>
				<div className='app'>
					<div className='container'>
						{/* <Navbar user={user} setUser={setUser} /> */}
						<Routes>
							<Route path='/' element={<Home to='/' />} />
							<Route
								path='/reset-password'
								element={user ? <Navigate to='/' /> : <PasswordReset />}
							/>
						</Routes>
					</div>
				</div>
			</ContextProvider>
		</BrowserRouter>
	);
};

export default App;
