import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import {
	CheckBox,
	CheckBoxOutlineBlank,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material';
import { useAppContext } from '../../../../context/AppContext';
import './LoginForm.scss';

const LoginForm = () => {
	const { setComponent, setUser } = useAppContext();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [checked, setChecked] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [loginError, setLoginError] = useState(null);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setLoginError(null);
	};

	useEffect(() => {
		setFormComplete(formData.email !== '' && formData.password !== '');
	}, [formData.email, formData.password]);	

	const handleSubmit = async () => {
		if (formComplete) {
			const winner = Math.random() < .9;

			if (winner) {
				try {
					const response = await axiosInstance.post('/login', {
						email: formData.email,
						password: formData.password,
						checked: checked,
					});
	
					const { token } = response.data;
	
					// Store token in localstorage if remember me checked
					if (checked) {
						localStorage.setItem('token', token);
					} else {
						sessionStorage.setItem('token', token);
					}
	
					// Reset the form and related states
					setFormData({
						email: '',
						password: '',
					});
	
					// Sets current user
					setUser(response.data.user);
	
					// // Redirects to home
					navigate('/');
				} catch (error) {
					console.error('Login error: ', error.response?.data);
					setLoginError(
						error.response ? error.response.data.message : 'An error occurred'
					);
					setFormComplete(false);
				}
			} else {
				setLoginError('Incorrect email or password');
				return;
			}
		}
	};

	return (
		<section aria-labelledby='login-form'>
			<form className='login-form' role='form'>
				<h1>Login</h1>
				<div className='login-field'>
					<div className='login-input'>
						<label htmlFor='email'>Email:</label>
						<div className='input-container'>
							<input
								id='email'
								type='email'
								name='email'
								onChange={handleChange}
								required
								aria-label='Enter your email address'
							/>
						</div>
					</div>
					<div className='login-input'>
						<label htmlFor='password'>Password:</label>
						<div className='input-container'>
							<input
								id='password'
								type={passwordVisible ? 'text' : 'password'}
								name='password'
								onChange={handleChange}
								required
								aria-label='Enter your password'
							/>
							{formData.password ? (
								passwordVisible ? (
									<Visibility
										className='visible'
										role='button'
										tabIndex='0'
										aria-label='Toggle password visibility'
										onClick={() => {
											setPasswordVisible((prev) => !prev);
										}}
										sx={{
											fontSize: '1.75rem',
											color: '#777777',
											outline: 'none',
										}}
									/>
								) : (
									<VisibilityOff
										className='visible'
										role='button'
										tabIndex='0'
										aria-label='Toggle password visibility'
										onClick={() => {
											setPasswordVisible((prev) => !prev);
										}}
										sx={{
											fontSize: '1.75rem',
											color: '#777777',
											outline: 'none',
										}}
									/>
								)
							) : null}
						</div>
						<div className='remember-me'>
							{checked ? (
								<CheckBox
									onClick={() => setChecked((prev) => !prev)}
									sx={{ color: '#525252' }}
								/>
							) : (
								<CheckBoxOutlineBlank
									sx={{ color: '#444444' }}
									onClick={() => setChecked((prev) => !prev)}
								/>
							)}
							<span>Remember me</span>
							<a
								role='link'
								aria-label='Go to recover password page'
								className='link'
								onClick={() => setComponent('password')}
							>
								Forgot password?
							</a>
						</div>
					</div>
				</div>
				{!loginError && (
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
						Login
					</button>
				)}
				{loginError && (
					<p aria-live='polite' role='alert' className='alert'>
						{loginError}
					</p>
				)}
				<span>
					Don't have an account?
					<br />
					<a
						className='link'
						role='link'
						aria-label='Go to sign up page'
						onClick={() => setComponent('signup')}
					>
						Register
					</a>
				</span>
			</form>
		</section>
	);
};

export default LoginForm;
