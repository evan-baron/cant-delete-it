import React, { useEffect, useState, useRef } from 'react';

const FloatingLetters = () => {
	const containerRef = useRef(null);
	const [letters, setLetters] = useState([]);
	const [clickedLetter, setClickedLetter] = useState('');

	useEffect(() => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@.'.split('');
		const container = containerRef.current;

		const initialLetters = chars.map((char) => ({
			id: char,
			letter: char,
			x: 140,
			y: 65,
			vx: (Math.random() * 2 - 1) * 0.25,
			vy: (Math.random() * 2 - 1) * 0.25,
		}));

		setLetters(initialLetters);

		let animationFrameId;

		const animate = () => {
			setLetters((prev) =>
				prev.map((l) => {
					let newX = l.x + l.vx;
					let newY = l.y + l.vy;

					if (newX < 0 || newX > container.offsetWidth - 24) l.vx *= -1;
					if (newY < 0 || newY > container.offsetHeight - 24) l.vy *= -1;

					return {
						...l,
						x: l.x + l.vx,
						y: l.y + l.vy,
					};
				})
			);

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animationFrameId);
	}, []);

	const handleClick = (letter) => {
		setClickedLetter((prev) => prev + letter);
	};

	return (
		<>
			<div
				ref={containerRef}
				style={{
					width: 300,
					height: 150,
					position: 'relative',
					overflow: 'hidden',
					border: '1px solid black',
				}}
			>
				{letters.map((l) => (
					<div
						key={l.id}
						onClick={() => handleClick(l.letter)}
						style={{
							position: 'absolute',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							left: l.x,
							top: l.y,
							color: l.color,
							fontFamily: 'roboto',
							fontSize: '1.25rem',
							cursor: 'pointer',
							userSelect: 'none',
							height: '24px',
							width: '24px',
							border: '1px solid black',
						}}
					>
						{l.letter}
					</div>
				))}
			</div>
			<div>{`Send recovery email to: ${clickedLetter}`}</div>
		</>
	);
};

export default FloatingLetters;
