import React, { useState, useEffect } from 'react';
import keyup from '../../assets/site/key_up.png';
import keydown from '../../assets/site/key_down.png';
import './LoadingKey.scss'; // Import the CSS file that contains the animation

const LoadingKey = () => {
	const [loadingText, setLoadingText] = useState('');

	useEffect(() => {
		const loadingStates = ['', '.', '..', '...'];
		let index = 0;

		const interval = setInterval(() => {
			setLoadingText(loadingStates[index]);
			index = (index + 1) % loadingStates.length; // Loop back to start
		}, 200);

		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	return (
		<div className='loading-box'>
			<div
				className='loading-key'
				style={{
					backgroundImage: `url(${keyup})`, // Set the initial image dynamically via inline style
				}}
			></div>
			<h2>Loading
				<div className='elipses'>{loadingText}</div>
			</h2>
		</div>
	);
};

export default LoadingKey;
