// External Libraries
import React, { useState, useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';

// MUI Icons
import { Check, Close } from '@mui/icons-material';

// Context
import { useAppContext } from '../../../../context/AppContext';

// Assets & Styles
import './leftSide.scss';
import words_dictionary from '../../../../utils/words_dictionary.json';
import { profilePictures } from '../../../../assets/site/demoProfilePic';

const LeftSide = () => {
	const { setComponent } = useAppContext();
	
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
		<section className='left-side'>
			<div className='content'>
				<div className='content-wrapper'>
					<section className='hero'>
						<h1 className='title'>
							Cant<span>&nbsp;</span>
							<span style={{ color: 'red' }}>Delete</span>
							<span>&nbsp;</span>It.
						</h1>
						<h2 className='pitch'>
							The world's worst social media site
						</h2>
					</section>

					<section className='rules' aria-labelledby='rules-section'>
						<h2 id='rules-section'>The Rules:</h2>
						<div className='divider'></div>
						<ul role='list'>
							<li role='listitem'>
								<Close
									sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
								/>
								<p>
									Your content will automatically post 30 seconds after
									your last keystroke.
								</p>
							</li>
							<li role='listitem'>
								<Close
									sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
								/>
								<p>
									You can't delete.{' '}
									<span className='bold'>Anything.</span> Pressing
									backspace removes 10 seconds from the timer.
								</p>
							</li>
							<li role='listitem'>
								<Close
									sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
								/>
								<p>
									You can't edit either. That includes no clicking back
									on previously typed words.
								</p>
							</li>
							<li role='listitem'>
								<Close
									sx={{
										color: 'rgb(255, 0, 0)',
										fontSize: '2rem',
									}}
								/>
								<p>
									Our spell-check{' '}
									<span className='misspelled'>doesn't</span> work. Get
									used to it.
								</p>
							</li>
						</ul>
					</section>

					<section className='demo' aria-labelledby='demo-section'>
						<h2 id='demo-section'>Try It Out:</h2>
						<div className='demo-container'>
							<div className='demo-content'>
								{/* FORM BELOW WILL EVENTUALLY BE A WRITE COMPONENT */}
								<form
									className='write-post'
									role='form'
									aria-labelledby='write-post-form'
								>
									<section className='input'>
										<textarea
											id='demoTextArea'
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
											aria-live='polite'
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
										<button
											type='button'
											onClick={demoSubmit}
											aria-label='Post content'
										>
											Post
										</button>
									</div>
								</form>

								{/* SECTION BELOW WILL EVENTUALLY BE A POST COMPONENT */}
								{demoPostData.visible && (
									<article className='posted-content'>
										<div className='profile-picture'>
											<img
												src={profilePic}
												alt='Demo User Profile Picture'
											/>
										</div>
										<div className='posted-content-container'>
											<h3 className='user'>{demoPostData.userName}</h3>
											<p className='post-content'>
												{checkedWords.map(
													({ word, isCorrect }, index) => (
														<React.Fragment key={index}>
															<span
																className={
																	isCorrect ? '' : 'misspelled'
																}
															>
																{word}
															</span>
															{index !== checkedWords.length - 1 && (
																<span>&nbsp;</span>
															)}
														</React.Fragment>
													)
												)}
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
									</article>
								)}
								<div className='style-blob-2'></div>
							</div>

							<button
								className='signup-button'
								type='button'
								onClick={() => setComponent('signup')}
								aria-label='Sign up'
							>
								Sign up
							</button>
						</div>
					</section>
				</div>
			</div>
			<div className='style-blob-1'></div>
		</section>
	);
};

export default LeftSide;
