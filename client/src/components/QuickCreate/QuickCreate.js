import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios'

import './QuickCreate.css';



const QuickCreate = ({ words, setGrid, setWords }) => {

	const [wordArray,setWordArray] = useState([])
    const [gridSize,setGridSize] = useState(15)
	const wordsInput = useRef()
	const gridSizeInput = useRef()

	const API_HOST = process.env.REACT_APP_API_HOST;

	useEffect( () => {
		setWordArray(words)
	},[words]);

	const handleSetWords = (words) => {
        
        setWordArray(
            words.split('\n')
                .map( (w) => w.toUpperCase().replaceAll(/[^A-Z]/g,''))
                .map( (w) => ({
                    isSelected: false,
                    string:w,
                    fromCell:null,
                    toCell:null
                }))
        )
        
        setGridSize( Math.max(getLongestWord(wordArray).string.length, 10) )
    }


    const getLongestWord = (allWords = []) => {
        const sortedWords = allWords.sort( (l,r) => l.string.length - r.string.length );
        return sortedWords.at(-1)
    }

	const generateGrid = () => {

        axios.post(`${API_HOST}/api/grid/new?width=${gridSize}`,{
			words: wordArray
		}).then((res) => {
			setGrid(res.data.grid)
			setWords(res.data.words)
		}).catch( (err) => {
			console.error(err)
		})
	}


	return  (
		<div className='builder-wrapper'>
			<div className='title'>Builder</div>
			<div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
				<textarea ref={wordsInput}  style={{height:500}} />
                <button onClick={ () => handleSetWords(wordsInput.current.value) }>Set Words Array</button>
			</div>
			<hr/>
			<div style={{display:'inline-flex', gap:'10px'}}>
				<input ref={gridSizeInput} value={gridSize} onChange={ (evt) => setGridSize( evt.target.value ) }/>
                    
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

export default QuickCreate;
