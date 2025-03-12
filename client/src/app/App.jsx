import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import './app.scss';

// Context
import { ContextProvider } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
import PasswordReset from '../pages/PasswordReset/PasswordReset.jsx';
// import Register from '../pages/Register.jsx';
// import Login from '../pages/Login.jsx';
// import PasswordRecovery from '../pages/PasswordRecovery.jsx';
// import Verify from '../pages/Verify';

// Components
// import Navbar from '../components/Navbar.jsx';

const App = () => {
	const { user } = ContextProvider;

	return (
		<ContextProvider>
			<div className='app'>
				<div className='container'>
					<BrowserRouter>
						{/* <Navbar user={user} setUser={setUser} /> */}
						<Routes>
							<Route path='/' element={<Home to='/'/>} />
							<Route path='/reset-password' element={user ? <Navigate to='/' /> : <PasswordReset />} />
							{/* <Route path='/verify' element={user ? <Navigate to='/' /> : <Verify />} /> */}
						</Routes>
					</BrowserRouter>
				</div>
			</div>
		</ContextProvider>
	);
};

export default App;
