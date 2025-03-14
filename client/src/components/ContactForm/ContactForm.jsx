import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import './contactForm.scss';

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [formComplete, setFormComplete] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [messageSent, setMessageSent] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setMessageSent(false);
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		setFormComplete(
			formData.name !== '' && formData.email !== '' && formData.message !== ''
		);
	}, [formData.name, formData.email, formData.message]);

	const maxLength = 1000;
	const remainingChars = maxLength - formData.message.length;

	useEffect(() => {}, [formData.message]);

	const handleSubmit = async (e) => {
		setIsSubmitting(true);

		try {
			const response = await axiosInstance.post('/contact', {
				name: formData.name,
				email: formData.email,
				message: formData.message,
			});
			response.status === 201 && setIsSubmitting(false);
		} catch (error) {
			console.error('There was an error submitting the message.', error);
		}
		setFormData({
			name: '',
			email: '',
			message: '',
		});
		setMessageSent(prev => !prev);
	};

	return (
		<section aria-labelledby='contact-form'>
			<form className='contact-form'>
				<h2>Contact Us</h2>
				<div className='contact-field'>
					<div className='contact-input'>
						<label htmlFor='name'>Name:</label>
						<div className='input-container'>
							<input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className='contact-input'>
						<label htmlFor='email'>Email:</label>
						<div className='input-container'>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className='contact-input'>
						<label htmlFor='message'>Message:</label>
						<div className='input-container'>
							<textarea
								id='message'
								name='message'
								value={formData.message}
								onChange={handleChange}
								maxLength='1000'
								rows='5'
								required
							/>
							<div className='char-count'>
								<span>{remainingChars}</span>
							</div>
						</div>
					</div>
				</div>
				{!messageSent ? (
					<button
						type='button'
						disabled={!formComplete || isSubmitting}
						style={{ opacity: !formComplete && '.5' }}
						onClick={() => handleSubmit()}
					>
						{isSubmitting ? 'Sending...' : 'Send'}
					</button>
				) : (
					<p className='message-sent'>Message sent!</p>
				)}
			</form>
		</section>
	);
};

export default ContactForm;
