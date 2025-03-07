import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Check, Close } from '@mui/icons-material';
import './home.scss';

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

	const demoChange = (e) => {
		setDemoFormData(e.target.value);
	};

	const demoSubmit = () => {
		setDemoPostData({
			visible: true,
			userName: 'Glizzy Kittles',
			content: demoFormData,
			timestamp: `${dayjs().format('MMMM DD, YYYY')}, at ${dayjs().format(
				'h:mm A'
			)}`,
		});

		setDemoFormData('');

		setTimeout(() => {
			console.log(demoFormData);
		}, 0);
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
												maxlength='69'
												placeholder='Why did the chicken cross the road?'
												onChange={demoChange}
												value={demoFormData}
											/>
											<div className='timer'>30</div>
										</section>
										<div className='input-decorations'>
											<p className='characters-remaining'>{69 - demoFormData.length} (normally 420 character limit)</p>
											<button type='button' onClick={demoSubmit}>
												Post
											</button>
										</div>
									</form>

									{/* SECTION BELOW WILL EVENTUALLY BE A POST COMPONENT */}
									<section className='posted-content'>
										<h3 className='user'>{demoPostData.userName}</h3>
										<p className='post-content'>{demoPostData.content}</p>
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
													<div className='post-score'>0</div>
												</div>
												<div className='score-box'>
													<Close
														className='symbol'
														sx={{ color: disapprove ? 'rgb(255, 0, 0)' : '#525252', fontSize: '1.5rem' }}
														onClick={() => {
															setDisapprove((prev) => !prev);
															setApprove(false);
														}}
													/>
													<div className='post-buttons-divider'></div>
													<div className='post-score'>0</div>
												</div>
											</div>
										</div>
									</section>
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
