// External Libraries
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Utilities
import axiosInstance from '../../utils/axios';

// MUI Icons
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';

// Styles
import './passwordReset.scss';

// Context
import { useAppContext } from '../../context/AppContext';

const PasswordReset = () => {
	// Context & Navigation
	const { screenHeight, screenWidth, setComponent, setSideActive } = useAppContext();
	const navigate = useNavigate();

	// URL & Query Parameters
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	// Form Data
	const [formData, setFormData] = useState({ password: '', confirm: '' });

	// Validation States
	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordReqs, setPasswordReqs] = useState({
		length: false,
		uppercase: false,
		number: false,
		character: false,
	});

	// Process States
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [tokenValid, setTokenValid] = useState(null);
	const [resendEmail, setResendEmail] = useState(null);
	const [emailSent, setEmailSent] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [passwordReset, setPasswordReset] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	// Extend Day.js with plugins
	dayjs.extend(utc);
	dayjs.extend(timezone);

	// Token Validation
	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				navigate('/');
				return;
			}
			try {
				const response = await axiosInstance.get('/authenticateRecoveryToken', {
					params: { token },
				});
				const { tokenValid, timeRemaining, email } = response.data;
				console.log(tokenValid);

				setResendEmail(email);
				setTokenValid(tokenValid);
				setTimeRemaining(tokenValid ? timeRemaining : 0);
			} catch (error) {
				console.error('Error authenticating token:', error);
			}
		};
		validateToken();
	}, [token]);

	// Countdown Timer
	useEffect(() => {
		if (!tokenValid || timeRemaining <= 0) {
			setTokenValid(false);
			return;
		}

		const timer = setInterval(() => {
			setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, [tokenValid, timeRemaining]);

	// Password Match & Validation
	useEffect(() => {
		const passwordsMatch =
			formData.password && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);
		setFormComplete(passwordsMatch);
	}, [formData.password, formData.confirm]);

	// Handle Input Change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorMessage(null);

		if (name === 'password') {
			const lengthValid = value.length >= 8;
			const uppercaseValid = /[A-Z]/.test(value);
			const numberValid = /\d/.test(value);
			const specialCharValid = /[@$!%*?&]/.test(value);

			setPasswordReqs({
				length: lengthValid,
				uppercase: uppercaseValid,
				number: numberValid,
				character: specialCharValid,
			});
			setPasswordValid(lengthValid && numberValid && specialCharValid);
		}
	};

	// Handle Form Submission
	const handleSubmit = async () => {
		if (!tokenValid) {
			try {
				setEmailSent(true);
				const data = await axiosInstance.post('/recover-password', {
					email: resendEmail,
					tokenName: 'email_recovery'
				});

				if (data) setResendEmail(null);
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error:', error.response?.data);
			}
			return;
		}

		if (!passwordValid) {
			console.log('Registration Error! Password Valid:', passwordValid);
			setFormComplete(false);
			return;
		}

		try {
			const response = await axiosInstance.post('/reset-password', {
				token,
				password: formData.password.trim(),
			});

			console.log(response);

			const { success, message } = response.data;

			if (success) {
				setFormData({ password: '', confirm: '' });
				setEmailSent(null);
				setPasswordReset((prev) => !prev);
				setPasswordValid(null);
				setPasswordVisible(false);
				setPasswordMatch(null);
				setTokenValid(false);
			} else {
				setErrorMessage(message);
			}

		} catch (error) {
			console.error('Registration error:', error.response?.data);
			setErrorMessage(
				error.response ? error.response.data.message : 'An error occurred'
			);
			setFormComplete(false);
		}
	};

	const screenSmall = (screenWidth < 720) || (screenHeight < 720);

	return (
		<div className='auth'>
			<section aria-labelledby='password-recovery-form'>
				<Link to='/'>
					<h1 id='password-recovery-form'>
						cant <span style={{ color: 'red' }}>delete</span> it
					</h1>
				</Link>
				<form role='form'>
					{tokenValid ? (
						<>
							<h1>Reset Password</h1>
							<h2>Please enter a new password.</h2>

							<p className='alert'>
								Time remaining: {Math.floor(timeRemaining / 60)}:
								{(timeRemaining % 60).toString().padStart(2, '0')}
							</p>

							<div className='password-field'>
								<div className='password-input'>
									<label htmlFor='password'>New Password:</label>
									<div className='input-container'>
										<input
											id='password'
											type={passwordVisible ? 'text' : 'password'}
											name='password'
											placeholder=''
											onChange={handleChange}
											required
											aria-label='Enter your password'
										/>
										{formData.password ? (
											passwordVisible ? (
												<Visibility
													className='visible'
													role='button'
													tabIndex='0'
													aria-label='Toggle password visibility'
													onClick={() => {
														setPasswordVisible((prev) => !prev);
													}}
													sx={{
														fontSize: '1.75rem',
														color: '#777777',
														outline: 'none',
													}}
												/>
											) : (
												<VisibilityOff
													className='visible'
													role='button'
													tabIndex='0'
													aria-label='Toggle password visibility'
													onClick={() => {
														setPasswordVisible((prev) => !prev);
													}}
													sx={{
														fontSize: '1.75rem',
														color: '#777777',
														outline: 'none',
													}}
												/>
											)
										) : null}
									</div>
								</div>
								<div className='password-input'>
									<label htmlFor='confirm'>Confirm Password:</label>
									<div className='input-container'>
										<input
											id='confirm'
											type='password'
											name='confirm'
											placeholder=''
											onChange={handleChange}
											required
											aria-label='Confirm your password'
										/>

										{passwordMatch !== null && formData.confirm ? (
											passwordMatch ? (
												<Check
													className='validatePw'
													role='img'
													aria-label='Passwords match'
													sx={{ color: 'rgb(0, 200, 0)', fontSize: '2rem' }}
												/>
											) : (
												<Close
													className='validatePw'
													role='img'
													aria-label='Passwords do not match'
													sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
												/>
											)
										) : null}
									</div>
									<div className='password-requirements'>
										<p className='requirements-description'>
											Your password must contain:
										</p>
										<div className='requirement'>
											{passwordReqs.length && (
												<Check
													sx={{
														fontSize: 'small',
														color: 'rgb(0, 200, 0)',
													}}
												/>
											)}
											<p>8 characters</p>
										</div>
										<div className='requirement'>
											{passwordReqs.uppercase && (
												<Check
													sx={{
														fontSize: 'small',
														color: 'rgb(0, 200, 0)',
													}}
												/>
											)}
											<p>1 uppercase</p>
										</div>
										<div className='requirement'>
											{passwordReqs.number && (
												<Check
													sx={{
														fontSize: 'small',
														color: 'rgb(0, 200, 0)',
													}}
												/>
											)}
											<p>1 number</p>
										</div>
										<div className='requirement'>
											{passwordReqs.character && (
												<Check
													sx={{
														fontSize: 'small',
														color: 'rgb(0, 200, 0)',
													}}
												/>
											)}
											<p>
												1 special character<span>&nbsp;</span>
												<span
													style={{
														color: 'rgba(0, 0, 0, .5)',
														fontSize: '.675rem',
													}}
												>
													(e.g. $, !, @, %, &)
												</span>
											</p>
										</div>
									</div>
								</div>
							</div>

							<button
								type='button'
								role='button'
								aria-label='Submit registration form'
								onClick={handleSubmit}
								disabled={!formComplete}
								style={{
									opacity: formComplete ? null : '.5',
									cursor: formComplete ? 'pointer' : null,
								}}
							>
								Reset Password
							</button>

							{errorMessage && (
								<p className='alert' aria-live='polite' role='alert'>
									{errorMessage}
								</p>
							)}
						</>
					) : !passwordReset ? (
						!emailSent ? (
							<>
								<h2>Sorry, this recovery link is no longer active.</h2>
								<button
									type='button'
									role='button'
									aria-label='Resend password'
									onClick={handleSubmit}
									disabled={formComplete}
									style={{
										opacity: !formComplete ? null : '.5',
										cursor: !formComplete ? 'pointer' : null,
									}}
								>
									Send New Link
								</button>
							</>
						) : (
							<>
								<h2>
									A password reset link has been sent to your email.
									<br />
									<br />
									Please check your inbox shortly. If you don't see it, please
									check your spam or junk folder.
								</h2>
								<h2 onClick={() => {
									setComponent('login');
									setSideActive('right');
								}}>
									<Link
										className='link'
										to='/'
										role='link'
										aria-label='Go to login page'
									>
										Return to Login
									</Link>
								</h2>
							</>
						)
					) : (
						<>
							<h2>
								Your password has been reset. Please return to the login page.
							</h2>
							<h2 onClick={() => {
								setComponent('login');
								setSideActive('right');
								}}>
								<Link
									className='link'
									to='/'
									role='link'
									aria-label='Go to login page'
								>
									Return to Login
								</Link>
							</h2>
						</>
					)}

					{!passwordReset && !emailSent && (
						<span>
							Return to Login?
							<br />
							<Link
								className='link'
								to='/'
								role='link'
								aria-label='Go to login page'
								onClick={() => {
									setComponent('login');
									setSideActive('right');
								}}
							>
								Login
							</Link>
						</span>
					)}
				</form>
			</section>
			{screenSmall && <div className="background-style">
				<div className='style-blob-1'></div>
			</div>}
		</div>
	);
};

export default PasswordReset;
