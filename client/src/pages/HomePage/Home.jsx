import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { Link } from 'react-router-dom';
import './home.scss';

const Home = ({ loading, user }) => {
	const [verified, setVerified] = useState(null);
	const [formComplete, setFormComplete] = useState(false);

	useEffect(() => {
		user && setVerified(user.verified);
	}, [user])

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
	}

	return (
		<div className="home">
			<div className="home-container">
				<div className="left-side">
					<div className="style-blob-1"></div>
				</div>
				<div className="right-side"></div>
			</div>
		</div>
	);
};

export default Home;
