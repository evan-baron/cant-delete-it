// External Libraries
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Context
import { useAppContext } from '../../../../context/AppContext';

// Styles
import './verify.scss';

const Verify = () => {
	// CONTEXT
	const { emailVerified, setComponent, setSideActive } = useAppContext();

	// ROUTER HOOKS
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	// HELPER FUNCTIONS
	const removeTokenFromUrl = () => {
		searchParams.delete('token');
		navigate(`?${searchParams.toString()}`, { replace: true });
	};

	return (
		<section aria-labelledby='password-recovery-form' className='verify-content'>
			<div className='verify-container'>
				<h1 id='password-recovery-form'>Email Verified</h1>
				<p>
					{!emailVerified
						? 'Thank you for verifying your email.'
						: `You've already verified your email.`}
				</p>
				<span>
					Continue to login
					<br />
					<a
						className='link'
						role='link'
						aria-label='Go to login page'
						onClick={() => {
							setComponent('login');
							removeTokenFromUrl();
						}}
					>
						Login
					</a>
				</span>
			</div>
		</section>
	);
};

export default Verify;
