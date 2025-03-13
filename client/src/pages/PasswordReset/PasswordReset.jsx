import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axiosInstance from '../../utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';
import './passwordReset.scss';
import { useAppContext } from '../../context/AppContext';

const PasswordReset = () => {
	const { setComponent } = useAppContext();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordReqs, setPasswordReqs] = useState({
		length: false,
		uppercase: false,
		number: false,
		character: false,
	});
	const [formComplete, setFormComplete] = useState(false);
	const [formData, setFormData] = useState({
		password: '',
		confirm: '',
	});
	const [errorMessage, setErrorMessage] = useState(null);
	const [tokenValid, setTokenValid] = useState(null);
	const [resendEmail, setResendEmail] = useState(null);
	const [emailSent, setEmailSent] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [passwordReset, setPasswordReset] = useState(false);

	const navigate = useNavigate();

	dayjs.extend(utc);
	dayjs.extend(timezone);

	//Email Recovery Token Validation
	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				navigate('/');
			} else {
				try {
					const response = await axiosInstance.get(
						'/authenticateRecoveryToken',
						{ params: { token: token } }
					);
					const { tokenValid, timeRemaining, email } = response.data;

					console.log(response.data);

					setResendEmail(email);

					if (tokenValid) {
						setTokenValid(true);
						setTimeRemaining(timeRemaining);
					} else {
						setTokenValid(false);
					}
				} catch (error) {
					console.error('Error authenticating token: ', error);
				}
			}
		};
		validateToken();
	}, [token]);

	// Countdown Timer
	useEffect(() => {
		let timer;
		if (tokenValid && timeRemaining > 0) {
			timer = setInterval(() => {
				setTimeRemaining((prev) => prev - 1);
			}, 1000);
		} else if (timeRemaining === 0) {
			setTokenValid(false);
		}
		return () => clearInterval(timer);
	}, [tokenValid, timeRemaining]);

	// Password Match Validation
	useEffect(() => {
		const passwordsMatch =
			formData.password !== '' && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);

		setFormComplete(passwordMatch);
	}, [formData.password, formData.confirm, passwordMatch]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'password') {
			// Check individual password requirements
			const lengthValid = value.length >= 8;
			const uppercaseValid = /[A-Z]/.test(value); // Checks for uppercase
			const numberValid = /\d/.test(value); // Checks for at least one number
			const specialCharValid = /[@$!%*?&]/.test(value); // Checks for special characters

			// Update password requirements state
			setPasswordReqs({
				length: lengthValid,
				uppercase: uppercaseValid,
				number: numberValid,
				character: specialCharValid,
			});

			// Update overall password validity
			setPasswordValid(lengthValid && numberValid && specialCharValid);
		}
	};

	const handleSubmit = async () => {
		if (tokenValid) {
			if (!passwordValid) {
				console.log(
					'Registration Error! Email Valid: Password Valid: ' + passwordValid
				);
				setFormComplete(false);
				return;
			} else {
				setFormComplete(false);
				try {
					await axiosInstance.post('/reset-password', {
						token: token, // Sending token in the request body
						password: formData.password.trim(),
					});

					// VALIDATION NEEDED IN FRONTEND AND BACKEND TO MAKE SURE NO SAME PASSWORD AS PREVIOUS, ETC.

					setFormData({
						password: '',
						confirm: '',
					});
					setEmailSent(null);
					setPasswordReset((prev) => !prev);
					setPasswordValid(null);
					setPasswordVisible(false);
					setPasswordMatch(null);
					setTokenValid(false);
				} catch (error) {
					console.error('Registration error: ', error.response?.data);
					setErrorMessage(
						error.response ? error.response.data.message : 'An error occurred'
					);
					setFormComplete(false);
				}
			}
		} else {
			console.log(token);
			console.log(resendEmail);
			setFormComplete(true);
			try {
				setEmailSent(true);
				const data = await axiosInstance.post('/recover-password', {
					email: resendEmail,
				});

				if (data) {
					setResendEmail(null);
				}
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error: ', error.response?.data);
			}
		}
	};

	return (
		<div className='auth' role='main'>
			<section aria-labelledby='password-recovery-form'>
				<h1 id='password-recovery-form'>
					cant <span style={{ color: 'red' }}>delete</span> it
				</h1>
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
								<h2 onClick={() => setComponent('login')}>
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
							<h2 onClick={() => setComponent('login')}>
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
								onClick={() => setComponent('login')}
							>
								Login
							</Link>
						</span>
					)}
				</form>
			</section>
		</div>
	);
};

export default PasswordReset;
