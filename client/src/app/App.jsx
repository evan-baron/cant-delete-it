// External Libraries
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../../reset.css';
import './app.scss';

// Context
import { useAppContext } from '../context/AppContext.jsx';

// Pages
import Home from '../pages/HomePage/Home.jsx';
import PasswordReset from '../pages/PasswordResetPage/PasswordReset.jsx';

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
