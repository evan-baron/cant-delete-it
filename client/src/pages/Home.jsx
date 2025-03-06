import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';

const Home = ({ loading, user }) => {
	const [verified, setVerified] = useState(null);
	const [formComplete, setFormComplete] = useState(false);

	useEffect(() => {
		user && setVerified(user.verified);
	}, [user])

	const handleSubmit = async () => {
		setFormComplete(true);
		try {
			await axiosInstance.post('/verify-email', {
				email: user.email,
				tokenName: 'email_verification',
			});
		} catch (error) {
			console.error('There was an error: ', error);
		}
	}

	return (
		<div className="home">
			<div className="home-container">
				{!loading && (user ? (
					verified ?
					(
					<h1>{`Welcome, ${user.first_name}!`}</h1>
					) : (
						<>
							<div className="button-container">
								<p>{`Hello, ${user.first_name}.`}</p>
								<p>Please verify your email!</p>
								<button
									className='button'
									type='button'
									role='button'
									aria-label='Resend password'
									onClick={handleSubmit}
									disabled={formComplete}
									style={{
										backgroundColor: !formComplete
											? null
											: 'rgba(0, 120, 120, .5)',
										cursor: !formComplete ? 'pointer' : null,
									}}
								>
									Resend Link
								</button>
							</div>
						</>
					)) : (
						<>
							<h2>Welcome!</h2>
							<div className="button-container">
								<Link to='/login' className='button'>
									Login
								</Link>
								<p>or</p>
								<Link to='/register' className='button'>
									Register
								</Link>
							</div>
						</>
					)
				)}
			</div>
		</div>
	);
};

export default Home;
