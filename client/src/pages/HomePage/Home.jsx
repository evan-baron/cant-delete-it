import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { Link } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import './home.scss';

const Home = ({ loading, user }) => {
	const [verified, setVerified] = useState(null);
	const [formComplete, setFormComplete] = useState(false);

	useEffect(() => {
		user && setVerified(user.verified);
	}, [user]);

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
	};

	return (
		<div className='home'>
			<div className='home-container'>
				<section className='left-side'>
					<div className='content'>
						<div className="content-wrapper">
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
											You can't delete. <span className='bold'>Anything.</span> Pressing backspace removes 10 seconds from the timer.
										</p>
									</li>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											You can't edit either. That includes no clicking back inside previously typed words.
										</p>
									</li>
									<li>
										<Close sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }} />
										<p>
											Your content will automatically post 30 seconds after your last keystroke.
										</p>
									</li>
								</ul>
							</section>
							<section className="demo">
								<h2>Try It Out:</h2>
								<div className="demo-container">
									{/* FORM BELOW WILL EVENTUALLY BE A WRITE COMPONENT */}
									<form className="write-post">
										<section className="input">
											<textarea type="text" maxlength="420" placeholder="What's on your mind?"></textarea>
											<div className="timer">30</div>
										</section>
										<div className="post-decorations">
											<p className="characters-remaining">420</p>
											<button type='button'>Post</button>
										</div>										
									</form>

									{/* SECTION BELOW WILL EVENTUALLY BE A POST COMPONENT */}
									<section className="posted-content">

									</section>
									<div className="style-blob-2"></div>
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
