import React, { useState,useEffect } from 'react';
import './Words.css';



const Words = ({ words, setGrid, setWords }) => {

	const [wordArray,setWordArray] = useState([])

	useEffect( () => {
		setWordArray(words)
	},[words]);

	return  (
		<div className='words-wrapper'>
			<div className='title'>Words</div>

			<div className="grid-words">
			{wordArray.sort((l,r) => {
				if(l.string > r.string) return 1;
				if(l.string < r.string) return -1;
				return 0;
			}).map((word, i) => (
				<div
					key={i}
					className={`word ${word.isSelected ? 'selected' : ''}`}
					style={{flexBasis:'25%'}}
				>
					{`${word.string} (${word.string.length})`}
				</div>
			))}

			</div>
		</div>
	) 
};

export default Words;
