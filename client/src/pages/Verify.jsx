import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Verify = () => {
	const [searchParams] = useSearchParams();
	const [emailVerified, setEmailVerified] = useState(null);

	const token = searchParams.get('token');

	const navigate = useNavigate();

	//Verification Token Validation
	useEffect(() => {
		const verifyEmail = async () => {
			if (!token) {
				console.log('No token found. Redirecting to home.');
				navigate('/');
			} else {
				try {
					const response = await axiosInstance.get('/authenticateVerifyToken', {
						params: { token: token },
					});
					const { userId, emailVerified } = response.data;

					if (emailVerified === 0) {
						setEmailVerified(false)
						try {
							console.log( userId, token );
							await axiosInstance.post('/updateVerified', {
								user_id: userId,
								token: token,
							});
						} catch (error) {
							console.log('There was an error.', error);
						}
					} else if (emailVerified === 1) {
						setEmailVerified(true)
					} else {
						console.error('Unrecognized emailVerified response.')
					}

				} catch (error) {
					console.error('Error authenticating token: ', error);
				}
			}
		};
		verifyEmail();
	}, [token]);

	return (
		<div className='auth' role='main'>
			<section aria-labelledby='password-recovery-form'>
				{!emailVerified ? (
					<>
						<h1 id='password-recovery-form'>Email Verified</h1>
						<h2>Thank you for verifying your email.</h2>
					</>
				) : (
					<>
						<h1>You've already verified.</h1>
					</>
				)}
			</section>
		</div>
	);
};

export default Verify;
