import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import './verify.scss';

const Verify = () => {
	const { emailVerified, setComponent } = useAppContext();

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
  
	const removeTokenFromUrl = () => {
	  searchParams.delete("token");
  
	  navigate(`?${searchParams.toString()}`, { replace: true });
	};

	return (
		<div className='auth' role='main'>
			<section aria-labelledby='password-recovery-form'>
				<div className='verify-container'>
					<h1 id='password-recovery-form'>Email Verified</h1>
					<p>{!emailVerified ? 'Thank you for verifying your email.' : `You've already verified your email.`}</p>
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
		</div>
	);
};

export default Verify;
