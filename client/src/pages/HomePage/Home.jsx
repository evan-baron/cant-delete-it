import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { Link } from 'react-router-dom';
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
						<section className='hero'>
							<h1 className='title'>Can't Delete It</h1>
							<p className='pitch'>The Pitch</p>
						</section>
						<section className='rules'>
							<h2>The Rules:</h2>
							<div className='divider'></div>
							<ul>
								<li>Rule 1</li>
								<li>Rule 2</li>
								<li>Rule 3</li>
								<li>Rule 4</li>
							</ul>
						</section>
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
