// External Libraries
import React from 'react';

// Assets & Styles
import './founderMessage.scss';
import signature from '../../../assets/site/signature_transparent.png';

const FounderMessage = () => {
	return (
		<section aria-labelledby='message-from-the-founder' className='message-container'>
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
					Or at least I hate what social media has become... I believe people
					spend far too much time on their thoughts, editing everything to be
					perfect and "just right" so that their audience or followers won't
					know the better.
					<br />
					<br />
					That's why I've created this monstrosity... a complete rebellion from
					modern day best practices. Say goodbye to your ability to edit,
					update, and delete. If you chose to sign up to this god forsaken
					platform, I hope you hate using it just as much as I do.
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
	);
};

export default FounderMessage;
