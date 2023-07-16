import React, { useRef } from 'react';
import axios from 'axios'

import './Words.css';



const Words = ({ words, setGrid, setWords }) => {

	const [wordArray,setWordArray] = React.useState([])
	const newWordInput = useRef()

	const API_HOST = process.env.REACT_APP_API_HOST;

	React.useEffect( () => {
		setWordArray(words)
	},[words]);

	const handleAddWord = (word) => setWordArray([
		...wordArray,
		{
			isSelected:false,
			string:word,
			fromCell:null,
			toCell:null
		},
	])

	const generateGrid = () => {
		axios.post(`${API_HOST}/api/grid/new?width=15`,{
			words: wordArray
		}).then((res) => {
			setGrid(res.data.grid)
			setWords(res.data.words)
		})
	}


	return  (
		<div className='words-wrapper noselect'>
			<div className='title'>Words</div>
			{wordArray.map((word, i) => (
				<div
					key={i}
					className={`word ${word.isSelected ? 'selected' : ''}`}
				>
					{word.string}
				</div>
			))}
			<hr/>

			<div style={{display:'inline-flex', gap:'10px'}}>
				<input type="text" ref={newWordInput} />
				<button onClick={()=>{
					handleAddWord( newWordInput.current.value )
					newWordInput.current.value = ""
				}}> + </button>
			</div>
			<hr/>
			<button onClick={()=>{
				generateGrid();
			}} style={{paddingBlock:'5px', paddingInline:'10px'}}>Generate</button>
			<hr/>
			<button onClick={ () => {
				setWordArray([])
			}}>Clear</button>
		</div>
	) 
};

export default Words;
