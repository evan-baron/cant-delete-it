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
	const [formStatus, setFormStatus] = useState('');
	const maxLength = 1000;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		setFormComplete(formData.name !== '' && formData.email !== '' && formData.message !== '');
	}, [formData.name, formData.email, formData.message])

	const remainingChars = maxLength - formData.message.length;

	useEffect(() => {

	}, [formData.message])

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setFormStatus('');

		try {
			// UPDATE LOGIC BELOW
			await axiosInstance.post('/contact', {
				email: formData.email,
				password: formData.password,
				checked: checked,
			});
			setIsSubmitting(false);
		} catch (error) {
			setFormStatus('There was an error submitting the form.');
		}
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
				<button type='button' disabled={formComplete || isSubmitting} style={{ opacity: !formComplete && '.5' }}>
					{isSubmitting ? 'Sending...' : 'Send'}
				</button>
			</form>
			{formStatus && <p>{formStatus}</p>}
		</section>
	);
};

export default ContactForm;
