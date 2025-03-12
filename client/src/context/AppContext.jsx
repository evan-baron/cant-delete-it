import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

// Create context
const AppContext = createContext(null);

// Create provider component
export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState('founder');

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

	return (
		<AppContext.Provider value={{ component, setComponent, user, setUser, loading }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
