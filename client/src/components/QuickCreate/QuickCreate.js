import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios'

import './QuickCreate.css';
import html2canvas from 'html2canvas';



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
        
        const allWords = words
            .split('\n')
            .map( (w) => w.toUpperCase().replaceAll(/[^A-Z ]/g,'').trim() ).map( (w) => ({
                isSelected: false,
                string:w.replaceAll(/[^A-Z]/g,''),
                label: w,
                fromCell:null,
                toCell:null
        }))

        setWordArray(allWords)
        
        setGridSize( Math.max(getLongestWord(allWords).string.length, 10) )
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
			setWords(wordArray)
		}).catch( (err) => {
			console.error(err)
		})
	}


	return  (
		<div className='builder-wrapper'>
			<div className='title'>Builder</div>
			<div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
				<textarea ref={wordsInput}  style={{height:500}} />
                <button style={{paddingBlock:10}} onClick={ () => handleSetWords(wordsInput.current.value) }>Set Words Array</button>
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
            <hr/>
            <button onClick={() => {
                html2canvas(document.querySelector('.grid-wrapper'),{
                    scale:2,
                    backgroundColor: null,

                }).then( canvas => {
                    canvas.classList.add('img-save')
                    document.body.appendChild(canvas)
                })

                html2canvas(document.querySelector('.grid-wrapper'),{
                    scale:2,
                    backgroundColor: null,
                    ignoreElements: (el) => {
                        return el.classList.contains('line')
                    }
                    
                }).then( canvas => {
                    canvas.classList.add('img-save')
                    document.body.appendChild(canvas)
                })

                Array.from( document.querySelectorAll('.word.selected') ).forEach( (el) => el.classList.remove('selected') );

                html2canvas(document.querySelector('.grid-words'),{
                    scale:2,
                    backgroundColor: null,
                    ignoreElements: (el) => {
                        return el.classList.contains('word-length')
                    }
                    
                }).then( canvas => {
                    canvas.classList.add('img-save')
                    document.body.appendChild(canvas)
                })
            }} style={{padding:5}}>Save</button>
		</div>
	) 
};

export default QuickCreate;
