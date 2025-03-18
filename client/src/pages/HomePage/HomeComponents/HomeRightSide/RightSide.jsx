// External Libraries
import React from 'react';

// MUI Icons
import { East, West } from '@mui/icons-material';

// Assets & Styles
import './rightSide.scss';

// Context
import { useAppContext } from '../../../../context/AppContext';

// Components
import FounderMessage from '../Founder/FounderMessage';
import Signup from '../Signup/Signup';
import LoginForm from '../Login/LoginForm';
import PasswordRecovery from '../PasswordRecovery/PasswordRecovery';
import Verify from '../Verify/Verify';
import ContactForm from '../../../../components/ContactForm/ContactForm';

const RightSide = () => {
	const { component, setComponent, screenHeight, screenWidth, setSideActive } = useAppContext();

	const screenSmall = (screenWidth < 720) || (screenHeight < 720);

	return (
		<section className='right-side'>
			<div className='content'>
				{component === 'founder' && <FounderMessage />}
				{component === 'signup' && <Signup />}
				{component === 'login' && <LoginForm />}
				{component === 'password' && <PasswordRecovery />}
				{component === 'verify' && <Verify />}
				{component === 'contact' && <ContactForm />}
				<a
					className='sign-up-link'
					onClick={() => {
						component !== 'founder'
							? setComponent('founder')
							: setComponent('signup');
							setSideActive('left');
					}}
					role='link'
					aria-label='Switch between founder message and sign up'
				>
					<West
						className={`arrow west-arrow ${
							component !== 'founder' ? 'visible' : 'hidden'
						}`}
						sx={{ color: screenWidth < 480  || screenHeight < 480 ? 'white' : '#252525' }}
					/>
					<span className='direction'>
						{component !== 'founder' ? (screenHeight < 480 ? 'Go back' : 'Return to Home') : 'Sign up'}
					</span>
					<East
						className={`arrow east-arrow ${
							component !== 'founder' ? 'hidden' : 'visible'
						}`}
						sx={{ color: screenWidth < 480 || screenHeight < 480 ? 'white' : '#252525' }}
					/>
				</a>
			</div>
			{screenSmall && <div className="background-style">
				<div className='style-blob-1'></div>
			</div>}
		</section>
	);
};

export default RightSide;
