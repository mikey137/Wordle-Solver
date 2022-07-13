import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WordList from '../WordList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import InstructionsModal from './InstructionsModal';
import { Functions } from './Functions';

function WordleSolver() {
    const [guesses, setGuesses] = useState(["raise"])
    const [indexTracker, setIndexTracker] = useState(["^", "^", "^", "^", "^"])
    const [includedLetters, setIncludedLetters] = useState("")
    const [wordList, setWordList] = useState(WordList)
    const [isFirstGuessSubmitted, setIsFirstGuessSubmitted] = useState(false)
    const [duplicateLetterInGuess, setDuplicateLetterInGuess] = useState()
    const [duplicateLettersInSolution, setDuplicateLettersInSolution] = useState("")
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const setBackgroundColor = (id, color) => {
        let currentLetter = document.getElementById(id)
        currentLetter.style.backgroundColor = color

        for(let i = 0; i < 5; i++){
            if(document.getElementById(`${guesses[guesses.length - 1]}-${i}`).style.backgroundColor !== ""){
                setIsButtonDisabled(false)
            }else{
                setIsButtonDisabled(true)
            }
        }
    } 

    const handleGuessSubmit = async () => {
        setIsButtonDisabled(true)
        setIsFirstGuessSubmitted(true)

        const updates = Functions.submitGuess(guesses[guesses.length - 1], indexTracker, includedLetters, duplicateLettersInSolution, duplicateLetterInGuess)

        const updatedWordList = Functions.updateWordList(wordList, updates.updatedIncludedLetters, updates.updatedIndexTracker, updates.updatedDuplicateLettersInSolution)

        setIndexTracker(updates.updatedIndexTracker)
        setIncludedLetters(updates.updatedIncludedLetters)
        setDuplicateLettersInSolution(updates.updatedDuplicateLettersInSolution)
        setWordList(updatedWordList)
        setDuplicateLetterInGuess("")
    }

    const handleFindNextGuess = () => {
        let nextGuess = Functions.findNextGuess(wordList, indexTracker, includedLetters)
        
        setGuesses([...guesses, nextGuess])
        setWordList(wordList.filter((word) => {
           return word !== nextGuess
        }))
        checkForDuplicateLetters(nextGuess)
    }

    const checkForDuplicateLetters = (guess) => {
        for(let i = 0; i < guess.length; i++){
            if(guess.indexOf(guess.charAt(i)) !== guess.lastIndexOf(guess.charAt(i))){
                setDuplicateLetterInGuess(guess.charAt(i))
                console.log('duplicate')
                break
            }
        }
    }

    const startOver = () => {
        window.location.reload(false)
    }

    useEffect(() => {
        if(isFirstGuessSubmitted){
            handleFindNextGuess()
        }  
    },[indexTracker])

    useEffect(() => {
        for(let i = 0; i < guesses.length - 1; i++){
            document.getElementById(`btn-${guesses[i]}`).style.display = "none"
        }
    },[guesses])

    return (
        <div>
            <InstructionsModal isModalOpen = {isModalOpen} setIsModalOpen = {setIsModalOpen}/>
            <FontAwesomeIcon 
                icon={faCircleQuestion}     
                className = "question-icon"
                onClick={handleOpenModal}
            />
            <div className="title">Wordle Solver</div>
            
            {guesses.map((guess) => (
                <div className= "guess-container" key={guess}>
                    <div className="word">
                        <div className="letter-container">
                            <div className="letter" id={`${guess}-0`}>
                                {guess.charAt(0)}
                            </div>
                            <div className={guesses[guesses.length - 1] === guess ? "btn-container" : "display-none"}>
                                <button 
                                    className="btn btn-green" 
                                    onClick={() => setBackgroundColor(`${guess}-0`, "rgb(106, 170, 100)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-yellow"
                                    onClick={() => setBackgroundColor(`${guess}-0`, "rgb(201, 180, 88)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-grey"
                                    onClick={() => setBackgroundColor(`${guess}-0`, "rgb(120, 124, 126)")}
                                >
                                </button>
                            </div>
                        </div>
                        <div className="letter-container">
                            <div className="letter" id={`${guess}-1`}>
                                {guess.charAt(1)}
                            </div>
                            <div className={guesses[guesses.length - 1] === guess ? "btn-container" : "display-none"}>
                                <button 
                                    className="btn btn-green" 
                                    onClick={() => setBackgroundColor(`${guess}-1`, "rgb(106, 170, 100)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-yellow"
                                    onClick={() => setBackgroundColor(`${guess}-1`, "rgb(201, 180, 88)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-grey"
                                    onClick={() => setBackgroundColor(`${guess}-1`, "rgb(120, 124, 126)")}
                                >
                                </button>
                            </div>
                        </div>
                        <div className="letter-container">
                            <div className="letter" id={`${guess}-2`}>
                                {guess.charAt(2)}
                            </div>
                            <div className={guesses[guesses.length - 1] === guess ? "btn-container" : "display-none"}>
                                <button 
                                    className="btn btn-green" 
                                    onClick={() => setBackgroundColor(`${guess}-2`, "rgb(106, 170, 100)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-yellow"
                                    onClick={() => setBackgroundColor(`${guess}-2`, "rgb(201, 180, 88)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-grey"
                                    onClick={() => setBackgroundColor(`${guess}-2`, "rgb(120, 124, 126)")}
                                >
                                </button>
                            </div>
                        </div>
                        <div className="letter-container">
                            <div className="letter" id={`${guess}-3`}>
                                {guess.charAt(3)}
                            </div>
                            <div className={guesses[guesses.length - 1] === guess ? "btn-container" : "display-none"}>
                                <button 
                                    className="btn btn-green" 
                                    onClick={() => setBackgroundColor(`${guess}-3`, "rgb(106, 170, 100)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-yellow"
                                    onClick={() => setBackgroundColor(`${guess}-3`, "rgb(201, 180, 88)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-grey"
                                    onClick={() => setBackgroundColor(`${guess}-3`, "rgb(120, 124, 126)")}
                                >
                                </button>
                            </div>
                        </div>
                        <div className="letter-container">
                            <div className="letter" id={`${guess}-4`}>
                                {guess.charAt(4)}
                            </div>
                            <div className={guesses[guesses.length - 1] === guess ? "btn-container" : "display-none"}>
                                <button 
                                    className="btn btn-green" 
                                    onClick={() => setBackgroundColor(`${guess}-4`, "rgb(106, 170, 100)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-yellow"
                                    onClick={() => setBackgroundColor(`${guess}-4`, "rgb(201, 180, 88)")}
                                >
                                </button>
                                <button 
                                    className="btn btn-grey"
                                    onClick={() => setBackgroundColor(`${guess}-4`, "rgb(120, 124, 126)")}
                                >
                                </button>
                            </div>
                        </div> 
                    </div>
                    <button 
                        className="submit-guess"
                        id = {`btn-${guess}`}
                        onClick={() => handleGuessSubmit(guess)}
                        disabled={isButtonDisabled}
                    >
                        Submit Guess
                    </button>           
                </div>
            ))}
            <button 
                className="start-over"
                onClick={startOver}
            >
                Start Over
            </button>
            <div className={isError ? "error-message" : "display-none"}>
                <h3>No Word Found, you may have marked a letter inccorectly</h3>
            </div>
        </div>   
    );
}

export default WordleSolver;