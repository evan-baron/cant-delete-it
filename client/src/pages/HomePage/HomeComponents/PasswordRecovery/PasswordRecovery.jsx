import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axios';
import { Link } from 'react-router-dom';
import './passwordRecovery.scss';
import { useAppContext } from '../../../../context/AppContext';

const PasswordRecovery = () => {
	const { setComponent } = useAppContext();
	const [formData, setFormData] = useState({
		email: '',
	});
	const [formComplete, setFormComplete] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		const emailIsValid =
			formData.email.includes('@') && formData.email.includes('.');
		setFormComplete(emailIsValid);
	}, [formData.email]);

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				setFormComplete(false);
				setEmailSent(true);
				const data = await axiosInstance.post('/recover-password', {
					email: formData.email,
					tokenName: 'email_recovery',
				});

				if (data) {
					// Reset the form and related states
					setFormData({
						email: '',
					});
				}
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error: ', error.response?.data);
			}
		}
	};

	return (
		<section aria-labelledby='password-recovery-form'>
			{!emailSent && (
				<form className='recovery-form' role='form'>
					<h1 id='password-recovery-form'>Recover Password</h1>
					<div className="input-field">						
						<h2>
							Please enter the email you registered with below to receive a password reset
							link.
						</h2>
						<div className="recovery-input">
							<label htmlFor='email'>Email:</label>
							<div className='input-container'>
								<input
									id='email'
									type='email'
									name='email'
									placeholder=''
									onChange={handleChange}
									required
									aria-label='Enter your email address'
								/>
							</div>
						</div>
					</div>
					<button
						type='button'
						role='button'
						aria-label='Submit registration form'
						onClick={handleSubmit}
						disabled={!formComplete}
						style={{
							opacity: formComplete ? null : '.5',
							cursor: formComplete ? 'pointer' : null,
						}}
					>
						Reset Password
					</button>

					{errorMessage && <div className='error-message'>{errorMessage}</div>}

					<span>
						Return to Login?
						<br />
						<a
							className='link'
							role='link'
							aria-label='Go to login page'
							onClick={() => setComponent('login')}
						>
							Login
						</a>
					</span>
				</form>
			)}
			{emailSent && (
				<div className='recovery-sent'>
					<h2>
						A password reset link has been sent to your email.
						<br />
						<br />
						Please check your inbox shortly. If you don't see it, please check
						your spam or junk folder.
					</h2>
					<h2>
						<a
							className='link'
							role='link'
							aria-label='Go to login page'
							onClick={() => setComponent('login')}
						>
							Return to Login
						</a>
					</h2>
				</div>
			)}
		</section>
	);
};

export default PasswordRecovery;
