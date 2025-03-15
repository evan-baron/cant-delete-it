// External Libraries
import React, { useEffect } from 'react';

// Assets & Styles
import './home.scss';

// MUI Icons
import { Login, Mail } from '@mui/icons-material';

// Context
import { useAppContext } from '../../context/AppContext';

// Components
import LeftSide from './HomeComponents/HomeLeftSide/LeftSide';
import RightSide from './HomeComponents/HomeRightSide/RightSide';

const Home = () => {
	// HOME LOGIC
	const { user, setComponent } = useAppContext();

	useEffect(() => {}, [user]);

	return (
		<main className='home'>
			<div className='home-container'>
				{user ? (
					<>
						<div>Hello {user.first_name}</div>
					</>
				) : (
					<>
						<LeftSide />
						<RightSide />
					</>
				)}
			</div>
			<div className='floating-links'>
				<div
					className='floating-link'
					onClick={() => setComponent('login')}
					role='button'
					aria-label='Login'
				>
					<Login
						sx={{
							fontSize: '2.5rem',
							filter: 'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
						}}
					/>
					<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
				</div>
				<div
					className='floating-link'
					aria-label='Get in touch'
					role='button'
					onClick={() => setComponent('contact')}
				>
					<Mail
						sx={{
							fontSize: '2.5rem',
							filter: 'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
						}}
					/>
					<p>Get in touch!</p>
				</div>
			</div>
		</main>
	);
};

export default Home;
