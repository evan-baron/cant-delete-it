import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Check, Close } from '@mui/icons-material';
import './home.scss';
import words_dictionary from '../../utils/words_dictionary.json';

const Home = ({ loading, user }) => {
	const [verified, setVerified] = useState(null);
	const [formComplete, setFormComplete] = useState(false);
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
	const [timeLeft, setTimeLeft] = useState(30);
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
		const match = word.match(/^(\W+)?([a-zA-Z0-9]+(?:['’][a-zA-Z0-9]+)*)(\W+)?$/);
		const searchWord = match?.[2]?.toLowerCase();
		const result = words_dictionary[searchWord] ? true : false;
		return result;
	}

	const handleKeyDown = (e) => {
		const keyNames = ['Backspace', 'ContextMenu', 'Control', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft'];

		const isValidKey = /^[a-zA-Z0-9\-=\[\]\\;',./`~!@#$%^&*()_+{}|:"<>? ]$|^Shift$/.test(e.key);

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
		if (keyNames.includes(e.key) || (e.ctrlKey && e.key === 'a') || (e.ctrlKey && e.key === 'z')) {
			e.preventDefault();
		}
		if (e.key === 'Enter') {
			demoSubmit();
			e.preventDefault();
		}
	}

	const demoChange = (e) => {
		setDemoFormData(e.target.value);
	};

	const demoSubmit = () => {

		setDemoPostData({
			visible: true,
			userName: 'Glizzy Kittles',
			content: demoFormData.split(' '),
			timestamp: `${dayjs().format('MMMM DD, YYYY')}, at ${dayjs().format(
				'h:mm A'
			)}`,
		});

		setDemoFormData('');
	};

	// useEffect(() => {
	// 	user && setVerified(user.verified);
	// }, [user]);

	// const handleSubmit = async () => {
	// 	setFormComplete(true);
	// 	try {
	// 		await axiosInstance.post('/verify-email', {
	// 			email: user.email,
	// 			tokenName: 'email_verification',
	// 		});
	// 	} catch (error) {
	// 		console.error('There was an error: ', error);
	// 	}
	// };

	return (
		<div className='home'>
			<div className='home-container'>
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
											<div className='timer' style={{color: timeLeft < 1000 && 'red'}}>{timeLeft > 1000 ? Math.round(timeLeft / 100) : (timeLeft / 100).toFixed(2)}</div>
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
											<h3 className='user'>{demoPostData.userName}</h3>
											<p className='post-content'>
												{demoPostData.content.map((word, index) => {
													if (index === demoPostData.content.length - 1) {
														if (spellCheckWord(word)) {
															return <span key={index}>{word}</span>;
														} else {
															return (
																<span className='misspelled' key={index}>
																	{word}
																</span>
															);
														}
													} else {
														if (spellCheckWord(word)) {
															return (
																<>
																	<span key={index}>{word}</span>
																	<span>&nbsp;</span>
																</>
															);
														} else {
															return (
																<>
																	<span className='misspelled' key={index}>
																		{word}
																	</span>
																	<span>&nbsp;</span>
																</>
															);
														}
													}
												})}
											</p>
											{/* <p className='post-content'>{demoPostData.content}</p> */}
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
				<section className='right-side'></section>
			</div>
		</div>
	);
};

export default Home;
