import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios'

import './Words.css';



const Words = ({ words, setGrid, setWords }) => {

	const [wordArray,setWordArray] = useState([])
	const newWordInput = useRef()
	const gridSizeInput = useRef()

	const API_HOST = process.env.REACT_APP_API_HOST;

	useEffect( () => {
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
		axios.post(`${API_HOST}/api/grid/new?width=${gridSizeInput.current.value}`,{
			words: wordArray
		}).then((res) => {
			setGrid(res.data.grid)
			setWords(res.data.words)
		}).catch( (err) => {
			console.error(err)
		})
	}


	return  (
		<div className='words-wrapper noselect'>
			<div className='title'>Words</div>
			{wordArray.sort((l,r) => {
				if(l.string > r.string) return 1;
				if(l.string < r.string) return -1;
				return 0;
			}).map((word, i) => (
				<div
					key={i}
					className={`word ${word.isSelected ? 'selected' : ''}`}
				>
					{`${word.string} (${word.string.length})`}
				</div>
			))}
			<hr/>

			<div style={{display:'inline-flex', gap:'10px'}}>
				<input type="text" ref={newWordInput} />
				<button onClick={()=>{
					handleAddWord( (newWordInput.current.value).toLowerCase() )
					newWordInput.current.value = ""
					newWordInput.current.focus()
				}}  style={{paddingBlock:'5px', paddingInline:'10px'}}> + </button>
			</div>
			<hr/>
			<div style={{display:'inline-flex', gap:'10px'}}>
				<select ref={gridSizeInput} defaultValue={12}>
					<option>10</option>
					<option>12</option>
					<option>15</option>
					<option>20</option>
				</select>
				<button onClick={()=>{
					generateGrid();
				}} style={{paddingBlock:'5px', paddingInline:'10px'}}>Generate</button>
			</div>
			<hr/>
			<button onClick={ () => {
				setWordArray([])
			}} style={{paddingBlock:'5px', paddingInline:'10px'}}>Clear</button>
		</div>
	) 
};

export default Words;
