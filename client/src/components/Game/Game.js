import React, { useState } from 'react';
import Grid from '../Grid/Grid';
import Words from '../Words/Words';
import QuickCreate from '../QuickCreate/QuickCreate';
import './Game.css';

const Game = () => {
	const [quickCreateMode, setQuickCreateMode] = useState(true)
	const [words, setWords] = useState([]);
	const [grid, setGrid] = useState({
		width: 0,
		size: 0,
		gridIn2D: [],
	});



	return (
		<div className='game-wrapper'>
			<div className="grid">
				<Grid
					grid={grid}
					setGrid={setGrid}
					words={words}
					setWords={setWords}
				/>
			</div>

			<div className="words">
				<Words
					words={words}
					setGrid={setGrid}
					setWords={setWords} />
			</div>

			<div className="builder">
				<input type='checkbox' onChange={ () => setQuickCreateMode(!quickCreateMode) } />
				<QuickCreate
					words={words}
					setGrid={setGrid}
					setWords={setWords} />
			</div>


			
		</div>
	);
};

export default Game;
