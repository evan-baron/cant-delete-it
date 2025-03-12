import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import './app.scss';

// Context
import { UserProvider } from '../context/UserContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
// import Register from '../pages/Register.jsx';
// import Login from '../pages/Login.jsx';
// import PasswordRecovery from '../pages/PasswordRecovery.jsx';
// import PasswordReset from '../pages/PasswordReset.jsx';
// import Verify from '../pages/Verify';

// Components
// import Navbar from '../components/Navbar.jsx';

const App = () => {
	return (
		<UserProvider>
			<div className='app'>
				<div className='container'>
					<BrowserRouter>
						{/* <Navbar user={user} setUser={setUser} /> */}
						<Routes>
							{/* <Route path='/' element={user ? <Home to='/' /> : <Signup to='/signup' />} /> */}
							<Route path='/' element={<Home to='/'/>} />
							{/* <Route path='/signup' element={user ? <Home to='/' /> : <Signup to='/signup' />} /> */}
							{/* <Route path='/signup' element={user ? <Home to='/' /> : <Signup to='/signup' />} /> */}
							{/* <Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
							<Route path='/recovery' element={user ? <Navigate to='/' /> : <PasswordRecovery />} />
							<Route path='/reset-password' element={user ? <Navigate to='/' /> : <PasswordReset />} />
							<Route path='/verify' element={user ? <Navigate to='/' /> : <Verify />} /> */}
						</Routes>
					</BrowserRouter>
				</div>
			</div>
		</UserProvider>
	);
};

export default App;
