import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { ContextProvider } from './context/AppContext';
import App from './app/App';
import '../reset.css';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<ContextProvider>
				<App />
			</ContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
