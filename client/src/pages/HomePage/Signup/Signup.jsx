import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axios';
import { Link } from 'react-router-dom';
import {
	Check,
	Close,
	East,
	Visibility,
	VisibilityOff,
	West,
} from '@mui/icons-material';
import './signup.scss';
import crossout from '../../../assets/site/crossout.png';
import { useAppContext } from '../../../context/AppContext';
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import LoadingKey from '../../../components/Loading/LoadingKey';

const Signup = () => {
	// CONTEXT
	const { setComponent } = useAppContext();

	//SIGNUP LOGIC
	const [formData, setFormData] = useState({
		first: '',
		last: '',
		email: '',
		password: '',
		confirm: '',
	});
	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [emailValid, setEmailValid] = useState(null);
	const [nameEmailComplete, setNameEmailComplete] = useState(false);
	const [nameEmailSubmitted, setNameEmailSubmitted] = useState(false);
	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordReqs, setPasswordReqs] = useState({
		length: false,
		uppercase: false,
		number: false,
		character: false,
	});
	const [formSubmitted, setFormSubmitted] = useState(null);
	const [registrationError, setRegistrationError] = useState(null);
	const [registrationComplete, setRegistrationComplete] = useState(false);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		const formCompleted = formData.first && formData.last && formData.email;
		setNameEmailComplete(formCompleted);
	}, [formData.first, formData.last, formData.email]);

	useEffect(() => {
		const passwordsMatch =
			formData.password !== '' && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);

		setFormComplete(formData.email && passwordMatch && passwordValid);
	}, [
		formData.password,
		formData.confirm,
		formData.email,
		passwordMatch,
		passwordValid,
	]);

	// Regex for email validation
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'email') {
			setEmailValid(emailRegex.test(value));
		}

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

		setFormSubmitted(false);
		setRegistrationError(null);
	};

	const handleNext = async () => {
		const { email } = formData;

		if (!nameEmailSubmitted) {
			try {
				const response = await axiosInstance.post('/check-email', {
					email: email.trim(),
				});

				const { available } = response.data;

				console.log(available);

				if (available) {
					setNameEmailSubmitted((prev) => !prev);
					console.log('Email ok to use');
				} else {
					console.log('Email already in use');
				}
			} catch (error) {
				console.error('Registration error: ', error.response?.data);
				setRegistrationError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setNameEmailComplete(false);
			}
		} else {
			setNameEmailSubmitted((prev) => !prev);
		}
	};

	const handleSubmit = async () => {
		setFormSubmitted(true);

		if (!emailValid || !passwordValid) {
			setFormComplete(false);
			return;
		} else {
			try {
				setLoadingScreen(true);
				const response = await axiosInstance.post('/register-account', {
					first: formData.first.trim(),
					last: formData.last.trim(),
					email: formData.email.trim(),
					password: formData.password.trim(),
				});
				console.log('Registration complete!');
				console.log(response.data);

				await axiosInstance.post('/verify-email', {
					email: formData.email,
					tokenName: 'email_verification',
				});
				setLoadingScreen(false);

				// Changes page to registration complete
				setRegistrationComplete(true);

				// Reset the form and related states
				setFormData({
					firstname: '',
					lastname: '',
					email: '',
					password: '',
					confirm: '',
				});

				setPasswordReqs({
					length: false,
					uppercase: false,
					number: false,
					character: false,
				});

				// Reset other relevant states
				setPasswordMatch(null);
				setPasswordVisible(false);
				setFormComplete(false);
				setEmailValid(null);
				setPasswordValid(null);
				setFormSubmitted(false);
				setNameEmailSubmitted(false);
			} catch (error) {
				console.error('Registration error: ', error.response?.data);
				setRegistrationError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setFormComplete(false);
			}
		}
	};

	return (
		<section aria-labelledby='sign-up-form' className='content'>
			{!registrationComplete ? (
				<form className='signup-form'>
					<h3>
						Don't Sign Up
						<img className='crossout-up' src={crossout} />
						<img className='crossout-down' src={crossout} />
					</h3>

					{loadingScreen ? (
						<LoadingKey />
					) : (
						<>
							{!nameEmailSubmitted ? (
								<section className='name-email'>
									<div className='registrant-name'>
										<div className='input-field'>
											<label htmlFor='email'>First Name:</label>
											<div className='input-container'>
												<input
													id='first'
													type='text'
													name='first'
													placeholder=''
													value={formData.first || ''}
													onChange={handleChange}
													required
													aria-label='First Name'
												/>
											</div>
										</div>
										<div className='input-field'>
											<label htmlFor='email'>Last Name:</label>
											<div className='input-container'>
												<input
													id='last'
													type='text'
													name='last'
													placeholder=''
													value={formData.last || ''}
													onChange={handleChange}
													required
													aria-label='Last Name'
												/>
											</div>
										</div>
									</div>
									<div className='input-field'>
										<label htmlFor='email'>Email:</label>
										<div className='input-container'>
											<input
												id='email'
												type='email'
												name='email'
												placeholder=''
												onChange={handleChange}
												value={formData.email || ''}
												required
												aria-label='Enter your email address'
											/>
										</div>
										{formSubmitted && !emailValid ? (
											<p className='validation-error' aria-live='polite'>
												Please enter a valid email address
											</p>
										) : null}
									</div>
								</section>
							) : (
								<section className='password-section'>
									<div className='input-field'>
										<label htmlFor='password'>Password:</label>
										<div className='input-container'>
											<input
												id='password'
												type={passwordVisible ? 'text' : 'password'}
												name='password'
												placeholder=''
												value={formData.password || ''}
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
									<div className='input-field'>
										<label htmlFor='confirm'>Confirm Password:</label>
										<div className='input-container'>
											<input
												id='confirm'
												type='password'
												name='confirm'
												value={formData.confirm || ''}
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
								</section>
							)}

							{!nameEmailSubmitted ? (
								<button
									type='button'
									role='button'
									aria-label='Confirm names and email'
									onClick={handleNext}
									disabled={!nameEmailComplete}
									style={{
										backgroundColor: nameEmailComplete
											? null
											: 'rgba(82, 82, 82, .5)',
										cursor: nameEmailComplete ? 'pointer' : null,
									}}
								>
									Next
									<East />
								</button>
							) : (
								<div className='back-submit'>
									<button
										className='back'
										type='button'
										role='button'
										aria-label='Confirm names and email'
										onClick={handleNext}
										style={{
											backgroundColor: nameEmailComplete
												? null
												: 'rgba(82, 82, 82, .5)',
											cursor: nameEmailComplete ? 'pointer' : null,
										}}
									>
										<West />
										Back
									</button>
									<button
										className='submit'
										type='button'
										role='button'
										aria-label='Submit registration form'
										onClick={handleSubmit}
										disabled={!formComplete}
										style={{
											backgroundColor: formComplete
												? null
												: 'rgba(82, 82, 82, .5)',
											cursor: formComplete ? 'pointer' : null,
										}}
									>
										Create Account
									</button>
								</div>
							)}

							{registrationError && (
								<p aria-live='polite' role='alert' className='alert'>
									{registrationError}
								</p>
							)}
						</>
					)}

					<span>
						Already have an account?
						<br />
						<a
							className='link'
							role='link'
							aria-label='Go to login page'
							onClick={() => setComponent('login')}
						>
							Login
						</a>
					</span>
				</form>
			) : (
				<form className='completed-form'>
					<h2>
						I'm <span style={{ fontStyle: 'italic' }}>very</span> confused
						why...
					</h2>
					<p>
						...but <span style={{ fontStyle: 'italic' }}>thank you</span> for
						registering with{' '}
						<span style={{ fontSize: '1.25rem' }}>
							cant <span style={{ color: 'red' }}>delete</span> it
						</span>
						. You must really hate traditional social media! Or you're
						masochistic... Either way...
					</p>
					<p>
						Please check your email for a link to verify your account. If it
						doesn't show up after a few minutes, check your spam or junk
						folders. Happy posting!
					</p>
					<p>- Evan</p>
				</form>
			)}
		</section>
	);
};

export default Signup;
