import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios'

import './QuickCreate.css';
import html2canvas from 'html2canvas';



const QuickCreate = ({ words, setGrid, setWords }) => {

	const [wordArray,setWordArray] = useState([])
    const [gridSize,setGridSize] = useState(15)
	const wordsInput = useRef()
	const gridSizeInput = useRef()
    const gameTitle = useRef()

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

    const exportAsPNG = (uri,filename) => {
        const link = document.createElement('a');
        const fullFileName = `${(gameTitle.current.value+"").replaceAll(/[^A-Za-z]/g,'-')}-${filename}`
        if (typeof link.download !== 'string') {
            window.open(uri);
        } else {
            link.href = uri;
            link.download = fullFileName.toLowerCase();
            link.click()
        }
    }


	return  (
		<div className='builder-wrapper'>
			<div className='title'>Builder</div>
            <div style={{display:'flex', flexDirection:'column', marginBottom:'10px'}}>
				<h2>Title</h2>
                <input style={{padding:6}} ref={gameTitle} />
			</div>
            <hr/>
			<div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
				<textarea ref={wordsInput}  style={{height:500}} />
                <button style={{paddingBlock:10}} onClick={ () => handleSetWords(wordsInput.current.value) }>Set Words Array</button>
			</div>
			<hr/>
			<div style={{display:'flex', gap:'10px'}}>
				<input ref={gridSizeInput} value={gridSize} onChange={ (evt) => setGridSize( evt.target.value ) }/>
                
                <div style={{display:'flex', justifyContent:'space-between', flexGrow:'1'}}>

                    <button onClick={()=>{
                        generateGrid();
                    }} style={{paddingBlock:'5px', paddingInline:'10px'}}>Generate Grid</button>

                    <button onClick={() => {
                        html2canvas(document.querySelector('.grid-wrapper'),{
                            scale:2,
                            backgroundColor: null,

                        }).then( canvas => {
                            exportAsPNG(canvas.toDataURL(),'solution.png')
                        })

                        html2canvas(document.querySelector('.grid-wrapper'),{
                            scale:2,
                            backgroundColor: null,
                            ignoreElements: (el) => {
                                return el.classList.contains('line')
                            }
                            
                        }).then( canvas => {
                            exportAsPNG(canvas.toDataURL(),'game.png')
                        })

                        Array.from( document.querySelectorAll('.word.selected') ).forEach( (el) => el.classList.remove('selected') );

                        html2canvas(document.querySelector('.grid-words'),{
                            scale:2,
                            backgroundColor: null,
                            ignoreElements: (el) => {
                                return el.classList.contains('word-length')
                            }
                            
                        }).then( canvas => {
                            exportAsPNG(canvas.toDataURL(),'words.png')
                        })
                    }} style={{padding:5}}>Export Images</button>
                </div>
            </div>
			
		</div>
	) 
};

export default QuickCreate;
