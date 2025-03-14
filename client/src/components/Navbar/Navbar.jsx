import React from 'react';
import axiosInstance from '../../utils/axios';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import './navbar.scss';

const Navbar = () => {
	const { user, setUser } = useAppContext();

	const handleLogout = async () => {
		try {
			await axiosInstance.post('/logout');
			setUser(null);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		}
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<div className='navbar'>
			<div className='nav-container'>
				<Link to='/' className='logo'>
					can't <span style={{color: 'red'}}>delete</span> it
				</Link>
				<div className='links'>
					<Link to='/' className='logout' onClick={handleLogout}>
						Logout
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
