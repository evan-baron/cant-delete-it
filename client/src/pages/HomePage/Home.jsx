// External Libraries
import React, { useEffect } from 'react';

// Assets & Styles
import './home.scss';

// Context
import { useAppContext } from '../../context/AppContext';

// Components
import LeftSide from './HomeComponents/HomeLeftSide/LeftSide';
import RightSide from './HomeComponents/HomeRightSide/RightSide';

const Home = () => {
	// HOME LOGIC
	const { user } = useAppContext();

	useEffect(() => {

	}, [user]);

	return (
		<main className='home'>
			<div className='home-container'>
				{user ? (
					<>
					<div>Hello {user.first_name}</div>
					</>
				) : (
					<>
						<LeftSide />
						<RightSide />
					</>
				)}
			</div>
		</main>
	);
};

export default Home;
