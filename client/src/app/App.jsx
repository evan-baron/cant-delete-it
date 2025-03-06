import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import './app.scss';
import axiosInstance from '../utils/axios';

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
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				console.log('Token exists!');
				console.log(token);
				try {
					const response = await axiosInstance.get('/authenticate', {
						headers: { Authorization: `Bearer ${token}` }
					})

					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
					console.log('No tokens found. Please log in.');
				}
			} else if (!token) {
				console.log('No token found. Checking cookies...');
				try { 
					const response = await axiosInstance.get('/authenticate', {
						withCredneitials: true,
					});

					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
					console.log('No tokens found. Please log in.');
				}
			} else {
				console.log('No tokens found. Please log in.');
			}

			setLoading(false);
		}

		fetchUserData();
	}, [loading]);

	useEffect(() => {
	}, [user])

	return (
		<div className='app'>
			<div className='container'>
				<BrowserRouter>
					{/* <Navbar user={user} setUser={setUser} /> */}
					<Routes>
						<Route path='/signup' element={<Home loading={loading} user={user} />} />
						{/* <Route path='/register' element={user ? <Navigate to='/' /> : <Register />} />
						<Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
						<Route path='/recovery' element={user ? <Navigate to='/' /> : <PasswordRecovery />} />
						<Route path='/reset-password' element={user ? <Navigate to='/' /> : <PasswordReset />} />
						<Route path='/verify' element={user ? <Navigate to='/' /> : <Verify />} /> */}
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
};

export default App;
