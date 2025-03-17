// External Libraries
import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Utilities
import axiosInstance from '../utils/axios';

// Create context
const AppContext = createContext(null);

// Create provider component
export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState('founder');
	const [searchParams] = useSearchParams();
	const [emailVerified, setEmailVerified] = useState(null);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [sideActive, setSideActive] = useState('left');

	const emailToken = searchParams.get('token');

	//Verification Token Validation
	useEffect(() => {
		const verifyEmail = async () => {
			if (!emailToken) {
				console.log('No token found. Redirecting to home.');
			} else {
				setComponent('verify');
				try {
					const response = await axiosInstance.get('/authenticateVerifyToken', {
						params: { token: emailToken },
					});
					const { userId, emailVerified } = response.data;

					if (emailVerified === 0) {
						setEmailVerified(false);
						try {
							console.log(userId, emailToken);
							await axiosInstance.post('/updateVerified', {
								user_id: userId,
								token: emailToken,
							});
						} catch (error) {
							console.log('There was an error.', error);
						}
					} else if (emailVerified === 1) {
						setEmailVerified(true);
					} else {
						console.error('Unrecognized emailVerified response.');
					}
				} catch (error) {
					console.error('Error authenticating token: ', error);
				}
			}
		};
		verifyEmail();
	}, [emailToken]);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token');

			if (token) {
				try {
					const response = await axiosInstance.get('/authenticate', {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			} else {
				try {
					const response = await axiosInstance.get('/authenticate', {
						withCredentials: true,
					});
					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
				}
			}

			setLoading(false);
		};

		fetchUserData();
	}, []);

	//Screenwidth Tracking
	useEffect(() => {
		const handleResize = () => setScreenWidth(window.innerWidth);

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<AppContext.Provider
			value={{
				component,
				setComponent,
				emailVerified,
				user,
				setUser,
				loading,
				screenWidth,
				sideActive,
				setSideActive
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
