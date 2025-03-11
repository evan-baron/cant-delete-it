import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../../utils/axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Check, Close, East, Visibility, VisibilityOff, West } from '@mui/icons-material';
import './signup.scss';
import words_dictionary from '../../utils/words_dictionary.json';
import { profilePictures } from '../../assets/site/demoProfilePic';
import signature from '../../assets/site/signature_transparent.png';
import crossout from '../../assets/site/crossout.png';

const Signup = ({ loading, user }) => {

	//SIGNUP LOGIC
	const [verified, setVerified] = useState(null);
	const [signup, setSignup] = useState(false);
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

		setFormComplete(
			formData.email &&
			passwordMatch
		);
	}, [
		formData.password,
		formData.confirm,
		formData.email,
		passwordMatch,
	]);

	// Regex for email validation
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Regex for password validation
	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
	
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
			setPasswordValid(passwordRegex.test(value));
		}
		setFormSubmitted(false);
		setRegistrationError(null);
	};

	const handleNext = async () => {
		const { email } = formData;

		if (!nameEmailSubmitted) {
			try {
				const response = await axiosInstance.post('/check-email', {
					email: email.trim()
				});
	
				const { available } = response.data;
	
				console.log(available);
	
				if (available) {
					setNameEmailSubmitted(prev => !prev);
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
			setNameEmailSubmitted(prev => !prev);
		}
	}

	const handleSubmit = async () => {
		setFormSubmitted(true);

		if (!emailValid || !passwordValid) {
			setFormComplete(false);
			return;
		} else {
			// Redirects to home
			// navigate('/login');
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

				// // Changes page to registration complete
				// setRegistrationComplete(true);

				// // Reset the form and related states
				// setFormData({
				// 	firstname: '',
				// 	lastname: '',
				// 	email: '',
				// 	password: '',
				// 	confirm: '',
				// });

				// // Reset other relevant states
				// setPasswordMatch(null);
				// setPasswordVisible(false);
				// setFormComplete(false);
				// setEmailValid(null);
				// setPasswordValid(null);
				// setFormSubmitted(false);

			} catch (error) {
				console.error('Registration error: ', error.response?.data);
				setRegistrationError(
					error.response ? error.response.data.message : 'An error occurred'
				);
				setFormComplete(false);
			}
		}
	};

	// DEMO LOGIC
	const [demoFormData, setDemoFormData] = useState('');
	const [demoPostData, setDemoPostData] = useState({
		visible: false,
		userName: '',
		content: '',
		timestamp: '',
	});
	const [approve, setApprove] = useState(false);
	const [disapprove, setDisapprove] = useState(false);
	const [postScore, setPostScore] = useState({
		approve: 0,
		disapprove: 0,
	});
	const [profilePic, setProfilePic] = useState(null);
	const [timeLeft, setTimeLeft] = useState(3000);
	const [countdownStarted, setCountdownStarted] = useState(false);

	useEffect(() => {
		if (countdownStarted) {
			const timer = setTimeout(() => {
				setTimeLeft((prev) => {
					if (prev > 0) {
						return prev - 1; // Decrement the time
					} else {
						setCountdownStarted(false);
						demoSubmit();
						setTimeLeft(3000); // Reset after countdown ends
						return prev;
					}
				});
			}, 10);

			return () => clearTimeout(timer); // Cleanup on component unmount
		}
	}, [timeLeft, countdownStarted]);

	const prevApprove = useRef(approve);
	const prevDisapprove = useRef(disapprove);

	useEffect(() => {
		// Only update score if the value has actually changed from a user interaction
		if (prevApprove.current !== approve) {
			setPostScore((prev) => ({
				...prev,
				approve: approve ? prev.approve + 1 : prev.approve - 1,
			}));
			prevApprove.current = approve;
		}
	}, [approve]);

	useEffect(() => {
		// Only update score if the value has actually changed from a user interaction
		if (prevDisapprove.current !== disapprove) {
			setPostScore((prev) => ({
				...prev,
				disapprove: disapprove ? prev.disapprove + 1 : prev.disapprove - 1,
			}));
			prevDisapprove.current = disapprove;
		}
	}, [disapprove]);

	const spellCheckWord = (word) => {
		const match = word.match(
			/^(\W+)?([a-zA-Z0-9]+(?:['’][a-zA-Z0-9]+)*)(\W+)?$/
		);

		if (!match || !match[2]) return false; // Return false if match or searchWord is undefined

		const searchWord = match[2].toLowerCase();

		return words_dictionary[searchWord] ? true : false;
	};

	const checkedWords = useMemo(() => {
		return (demoPostData?.content || []).map((word) => ({
			word,
			isCorrect: spellCheckWord(word),
		}));
	}, [demoPostData.content]);

	const handleKeyDown = (e) => {
		const keyNames = [
			'Backspace',
			'ContextMenu',
			'Control',
			'Delete',
			'ArrowUp',
			'ArrowDown',
			'ArrowLeft',
		];

		const isValidKey =
			/^[a-zA-Z0-9\-=\[\]\\;',./`~!@#$%^&*()_+{}|:"<>? ]$|^Shift$/.test(e.key);

		if (isValidKey) {
			setTimeLeft(3000);
			setCountdownStarted(true);
		}
		if (e.key === 'Backspace' && countdownStarted) {
			e.preventDefault();
			setTimeLeft((prev) => {
				if (timeLeft > 0) {
					return prev - 1000;
				}
				return prev;
			});
		}
		if (
			keyNames.includes(e.key) ||
			(e.ctrlKey && e.key === 'a') ||
			(e.ctrlKey && e.key === 'z')
		) {
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			if (demoFormData.length > 0) {
				demoSubmit();
			}
		}
	};

	const demoChange = (e) => {
		setDemoFormData(e.target.value);
	};

	const demoSubmit = () => {
		setProfilePic(profilePictures[Math.floor(Math.random() * 8)].img);

		setDemoPostData({
			visible: true,
			userName: 'Glizzy Kittles',
			content: demoFormData.split(' '),
			timestamp: `${dayjs().format('MMMM DD, YYYY')}, at ${dayjs().format(
				'h:mm A'
			)}`,
		});

		setDemoFormData('');
		setCountdownStarted(false);
		setTimeLeft(3000);
	};

	// useEffect(() => {
	// 	user && setVerified(user.verified);
	// }, [user]);

	// const handleSubmit = async () => {
	// 	setFormComplete(true);
	// 	console.log(formData.email);
	// 	try {
	// 		await axiosInstance.post('/verify-email', {
	// 			email: formData.email,
	// 			tokenName: 'email_verification',
	// 		});
	// 	} catch (error) {
	// 		console.error('There was an error: ', error);
	// 	}
	// };

	return (
		<div className='signup'>
			<div className='signup-container'>
				<section className='left-side'>
					<div className='content'>
						<div className='content-wrapper'>
							<section className='hero'>
								<h1 className='title'>Cant Delete It.</h1>
								<h2 className='pitch'>The world's worst social media site</h2>
							</section>
							<section className='rules'>
								<h2>The Rules:</h2>
								<div className='divider'></div>
								<ul>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											You can't delete. <span className='bold'>Anything.</span>{' '}
											Pressing backspace removes 10 seconds from the timer.
										</p>
									</li>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											You can't edit either. That includes no clicking back
											inside previously typed words.
										</p>
									</li>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											Your content will automatically post 30 seconds after your
											last keystroke.
										</p>
									</li>
									<li>
										<Close
											sx={{
												color: 'rgb(255, 0, 0)',
												fontSize: '2rem',
											}}
										/>
										<p>
											Our spell-check{' '}
											<span className='misspelled'>doesn't</span> work. Get used
											to it.
										</p>
									</li>
								</ul>
							</section>
							<section className='demo'>
								<h2>Try It Out:</h2>
								<div className='demo-container'>
									{/* FORM BELOW WILL EVENTUALLY BE A WRITE COMPONENT */}
									<form className='write-post'>
										<section className='input'>
											<textarea
												type='text'
												maxLength='69'
												placeholder='Signing up is a really bad idea...'
												onChange={demoChange}
												value={demoFormData}
												onKeyDown={handleKeyDown}
												onKeyUp={(e) => {
													if (e.key === 'Backspace') {
														if (timeLeft <= 0) {
															setTimeLeft(3000);
														} else {
															return;
														}
													}
												}}
												onContextMenu={(e) => {
													e.preventDefault();
												}}
												onMouseDown={(e) => {
													e.target.focus();
													e.preventDefault();
													return;
												}}
											/>
											<div
												className='timer'
												style={{ color: timeLeft < 1000 && 'red' }}
											>
												{countdownStarted &&
													(timeLeft > 1000
														? Math.round(timeLeft / 100)
														: (timeLeft / 100).toFixed(2))}
											</div>
										</section>
										<div className='input-decorations'>
											<p className='characters-remaining'>
												{69 - demoFormData.length} (normally 420 character
												limit)
											</p>
											<button type='button' onClick={demoSubmit}>
												Post
											</button>
										</div>
									</form>

									{/* SECTION BELOW WILL EVENTUALLY BE A POST COMPONENT */}
									{demoPostData.visible && (
										<section className='posted-content'>
											<div className='profile-picture'>
												<img src={profilePic} alt='Profile' />
											</div>
											<div className='posted-content-container'>
												<h3 className='user'>{demoPostData.userName}</h3>
												<p className='post-content'>
													{checkedWords.map(({ word, isCorrect }, index) => (
														<React.Fragment key={index}>
															<span className={isCorrect ? '' : 'misspelled'}>
																{word}
															</span>
															{index !== checkedWords.length - 1 && (
																<span>&nbsp;</span>
															)}
														</React.Fragment>
													))}
												</p>
												<div className='post-decorations'>
													<p className='timestamp'>{demoPostData.timestamp}</p>
													<div className='post-buttons'>
														<div className='score-box'>
															<Check
																className='symbol'
																sx={{
																	color: approve ? 'rgb(0, 200, 0)' : '#525252',
																	fontSize: '1.5rem',
																	transform: 'translateY(-1px)',
																}}
																onClick={() => {
																	setApprove((prev) => !prev);
																	setDisapprove(false);
																}}
															/>
															<div className='post-buttons-divider'></div>
															<div className='post-score'>
																{postScore.approve}
															</div>
														</div>
														<div className='score-box'>
															<Close
																className='symbol'
																sx={{
																	color: disapprove
																		? 'rgb(255, 0, 0)'
																		: '#525252',
																	fontSize: '1.5rem',
																}}
																onClick={() => {
																	setDisapprove((prev) => !prev);
																	setApprove(false);
																}}
															/>
															<div className='post-buttons-divider'></div>
															<div className='post-score'>
																{postScore.disapprove}
															</div>
														</div>
													</div>
												</div>
											</div>
										</section>
									)}
									<div className='style-blob-2'></div>
								</div>
							</section>
						</div>
						<div className='contact'>Contact Us</div>
					</div>
					<div className='style-blob-1'></div>
				</section>
				<section className='right-side'>
					<div className='content'>
						{signup ? (
							<form className='signup-form'>
								<h3>
									Don't Sign Up
									<img className='crossout-up' src={crossout} />
									<img className='crossout-down' src={crossout} />
								</h3>

								{!nameEmailSubmitted ? (
									<section className='name-email'>
										<div className='registrant-name'>
											<div className='name-box'>
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
											<div className='name-box'>
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
									</section>
								) : (
									<section className='password-section'>
										<label htmlFor='password'>Password:</label>
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
										{formSubmitted && !passwordValid ? (
											<p className='validation-error' aria-live='polite'>
												Password must be at least 8 characters, include 1
												uppercase letter, 1 number, and 1 special character.
											</p>
										) : null}

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
											disabled={!nameEmailComplete}
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
									<p aria-live='polite' role='alert'>
										{registrationError}
									</p>
								)}
								<span>
									Already have an account?
									<br />
									<Link
										className='link'
										to='/login'
										role='link'
										aria-label='Go to login page'
									>
										Login
									</Link>
								</span>
							</form>
						) : (
							<section className='message-container'>
								<h2 className='message-title'>A message from the founder:</h2>
								<section className='message-contents'>
									<p>
										<span className='opening'>Welcome!</span>{' '}
										<span style={{ color: '#696969', fontSize: '1.25rem' }}>
											...and for your sanity, I sincerely hope goodbye!
										</span>
										<br />
										<br />
										<span
											style={{
												color: 'red',
												fontStyle: 'italic',
												fontWeight: 'bold',
											}}
										>
											I hate social media.
										</span>{' '}
										Or at least I hate what social media has become... I believe
										people spend far too much time on their thoughts, editing
										everything to be perfect and "just right" so that their
										audience or followers won't know the better.
										<br />
										<br />
										That's why I've created this monstrosity... a complete
										rebellion from modern day best practices. Say goodbye to
										your ability to edit, update, and delete. If you chose to
										sign up to this god forsaken platform, I hope you hate using
										it just as much as I do.
										<br />
										<br />
										Happy <span className='misspelled'>typoing</span>,
									</p>
									<img className='signature' src={signature} />
									<p>
										Evan Baron
										<br />
										Chief Typo Officer
									</p>
								</section>
							</section>
						)}
						<a
							className='sign-up-link'
							onClick={() => setSignup((prev) => !prev)}
						>
							<West
								className={`arrow west-arrow ${signup ? 'visible' : 'hidden'}`}
							/>
							<span className='direction'>{signup ? 'Back' : 'Sign up'}</span>
							<East
								className={`arrow east-arrow ${signup ? 'hidden' : 'visible'}`}
							/>
						</a>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Signup;
