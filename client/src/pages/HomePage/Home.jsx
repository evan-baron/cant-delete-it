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
	const { user, screenWidth, sideActive, setSideActive, component, setComponent } = useAppContext();

	useEffect(() => {}, [user]);

	return (
		<main className='home'>
			<div className='home-container'>
				{user ? (
					<>
						<div>Hello {user.first_name}</div>
					</>
				) : screenWidth > 820 ? (
					<>
						<LeftSide />
						<RightSide />
					</>
				) : (
					<>
						{sideActive === 'left' && <LeftSide />}
						{sideActive === 'right' && <RightSide />}
					</>
				)}
			</div>
			<div className='floating-links'>
				{screenWidth > 480 ? (
					<>
						<div
							className='floating-link'
							onClick={() => {
								setComponent('login');
								setSideActive('right');
							}}
							role='button'
							aria-label='Login'
						>
							{screenWidth > 480 ? (component !== 'login' && 
								<>
									<Login
										className='floating-icon'
										sx={{
											fontSize: '2.5rem',
											filter:
												'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
										}}
									/>
									<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
								</>
							) : (component !== 'login' && 
								<>
									<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
									<Login
										className='floating-icon'
										sx={{
											fontSize: '2.5rem',
											filter:
												'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
										}}
									/>
								</>
							)}
						</div>
						<div
							className='floating-link'
							aria-label='Get in touch'
							role='button'
							onClick={() => {
								setComponent('contact');
								setSideActive('right');
							}}
						>
							<Mail
								className='floating-icon'
								sx={{
									fontSize: '2.5rem',
									filter: 'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
								}}
							/>
							<p>Get in touch!</p>
						</div>
					</>
				) : (
					<>
						<div
							className='floating-link'
							aria-label='Get in touch'
							role='button'
							onClick={() => {
								setComponent('contact');
								setSideActive('right');
							}}
						>
							<Mail
								className='floating-icon'
								sx={{
									fontSize: '2.5rem',
									filter: 'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
								}}
							/>
							<p>Get in touch!</p>
						</div>
						<div
							className='floating-link'
							onClick={() => {
								setComponent('login');
								setSideActive('right');
							}}
							role='button'
							aria-label='Login'
						>
							{screenWidth > 480 ? (component !== 'login' && 
								<>
									<Login
										className='floating-icon'
										sx={{
											fontSize: '2.5rem',
											filter:
												'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
										}}
									/>
									<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
								</>
							) : ( component !== 'login' &&
								<>
									<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
									<Login
										className='floating-icon'
										sx={{
											fontSize: '2.5rem',
											filter:
												'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
										}}
									/>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</main>
	);
};

export default Home;
