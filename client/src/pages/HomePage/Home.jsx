import React, { useState, useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import {
	Check,
	Close,
	East,
	Login,
	Mail,
	West
} from '@mui/icons-material';
import './home.scss';
import words_dictionary from '../../utils/words_dictionary.json';
import { profilePictures } from '../../assets/site/demoProfilePic';

// Components
import FounderMessage from './FounderMessage';
import Signup from '../SignupPage/Signup';

const Home = () => {
	// HOME LOGIC

	// RIGHT SIDE / COMPONENTS LOGIC
	const [component, setComponent] = useState('founder');

	// LEFT SIDE / DEMO LOGIC
	const [demoFormData, setDemoFormData] = useState('');
	const [demoPostData, setDemoPostData] = useState({
		visible: false,
		userName: '',
		content: [],
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
						return prev - 1;
					} else {
						setCountdownStarted(false);
						demoSubmit();
						setTimeLeft(3000);
						return prev;
					}
				});
			}, 10);

			return () => clearTimeout(timer);
		}
	}, [timeLeft, countdownStarted]);

	const prevApprove = useRef(approve);
	const prevDisapprove = useRef(disapprove);

	useEffect(() => {
		if (prevApprove.current !== approve) {
			setPostScore((prev) => ({
				...prev,
				approve: approve ? prev.approve + 1 : prev.approve - 1,
			}));
			prevApprove.current = approve;
		}
	}, [approve]);

	useEffect(() => {
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

		if (!match || !match[2]) return false;

		const searchWord = match[2].toLowerCase();

		return words_dictionary[searchWord] ? true : false;
	};

	const checkedWords = useMemo(() => {
		return (demoPostData?.content || [])
			.filter((word) => word.trim().length > 0) // Removes more than one spaces back to back
			.map((word) => ({
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
			demoFormData.length > 0 && setCountdownStarted(true);
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
			(e.ctrlKey && e.key === 'z') ||
			(e.ctrlKey && e.key === 'v')
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
		e.target.value !== ' ' && setDemoFormData(e.target.value); // Prevents spaces and empty data from being processed as a 'word'
	};

	const demoSubmit = () => {
		if (!demoFormData) {
			return;
		} else {
			setProfilePic(profilePictures[Math.floor(Math.random() * 8)].img);
			setDemoPostData({
				visible: true,
				userName: 'Glizzy Kittles',
				content: demoFormData.split(' '),
				timestamp: `${dayjs().format('MMMM DD, YYYY')}, at ${dayjs().format(
					'h:mm A'
				)}`,
			});
		}

		setDemoFormData('');
		setCountdownStarted(false);
		setTimeLeft(3000);
	};

	return (
		<div className='home'>
			<div className='home-container'>
				<section className='left-side'>
					<div className='content'>
						<div className='content-wrapper'>
							<section className='hero'>
								<h1 className='title'>
									Cant<span>&nbsp;</span>
									<span style={{ color: 'red' }}>Delete</span>
									<span>&nbsp;</span>It.
								</h1>
								<h2 className='pitch'>The world's worst social media site</h2>
							</section>
							<section className='rules'>
								<h2>The Rules:</h2>
								<div className='divider'></div>
								<ul>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											Your content will automatically post 30 seconds after your
											last keystroke.
										</p>
									</li>
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
											You can't edit either. That includes no clicking back on
											previously typed words.
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
									<div className='demo-content'>
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
														<p className='timestamp'>
															{demoPostData.timestamp}
														</p>
														<div className='post-buttons'>
															<div className='score-box'>
																<Check
																	className='symbol'
																	sx={{
																		color: approve
																			? 'rgb(0, 200, 0)'
																			: '#525252',
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
									<button
										className='signup-button'
										type='button'
										onClick={() => setComponent('signup')}
									>
										Sign up
									</button>
								</div>
							</section>
						</div>
						<div className='floating-links'>
							<div className='floating-link'>
								<Login
									sx={{
										fontSize: '2.5rem',
										filter:
											'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
									}}
								/>
								<p style={{ color: 'red', fontWeight: 'bold' }}>Login</p>
							</div>
							<div className='floating-link'>
								<Mail
									sx={{
										fontSize: '2.5rem',
										filter:
											'drop-shadow(.5rem .5rem .25rem rgba(0, 0, 0, .375))',
									}}
								/>
								<p>Get in touch!</p>
							</div>
						</div>
					</div>
					<div className='style-blob-1'></div>
				</section>

				<section className='right-side'>
					{component === 'founder' && <FounderMessage />}
					{component === 'signup' && <Signup />}
					<a
						className='sign-up-link'
						onClick={() => {component === 'founder' ? setComponent('signup') : setComponent('founder')}}
					>
						<West
							className={`arrow west-arrow ${component === 'signup' ? 'visible' : 'hidden'}`}
							sx={{ color: '#252525' }}
						/>
						<span className='direction'>{component === 'signup' ? 'Back' : 'Sign up'}</span>
						<East
							className={`arrow east-arrow ${component === 'signup' ? 'hidden' : 'visible'}`}
							sx={{ color: '#252525' }}
						/>
					</a>
				</section>
			</div>
		</div>
	);
};

export default Home;
