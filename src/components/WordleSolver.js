import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WordList from '../WordList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import InstructionsModal from './InstructionsModal';

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

    const handleGuessSubmit = (guess) => {
        setIsButtonDisabled(true)
        setIsFirstGuessSubmitted(true)
        let updatedIndexTracker = [...indexTracker]
        let updatedIncludedLetters = includedLetters
        let updatedDuplicateLettersInSolution = duplicateLettersInSolution
        let duplicateLetterIndexes = []

        if(duplicateLetterInGuess){
            for(let i = 0; i < 5; i++){
                if(guess.charAt(i) === duplicateLetterInGuess){
                    duplicateLetterIndexes.push(i)
                }
            }  
            let colorAtIndex0 = document.getElementById(`${guess}-${duplicateLetterIndexes[0]}`).style.backgroundColor
            let colorAtIndex1 = document.getElementById(`${guess}-${duplicateLetterIndexes[1]}`).style.backgroundColor
            console.log(colorAtIndex0, colorAtIndex1)

            if(colorAtIndex0 !== "rgb(120, 124, 126)" && colorAtIndex1 !== "rgb(120, 124, 126)"){
                updatedDuplicateLettersInSolution = duplicateLetterInGuess
            }

            if(colorAtIndex0 === "rgb(120, 124, 126)" && colorAtIndex1 === "rgb(120, 124, 126)"){
                for(let j = 0; j < 5; j++){
                    if(updatedIndexTracker[j].includes("^")){
                        updatedIndexTracker[j] = updatedIndexTracker[j] + duplicateLetterInGuess
                    }
                }
            }
        }

        for(let i = 0; i < 5; i++){
            let currentLetterColor = document.getElementById(`${guess}-${i}`).style.backgroundColor

            if(currentLetterColor === "rgb(106, 170, 100)" && indexTracker[i].includes("^")){
                updatedIndexTracker[i] = guess.charAt(i)
                updatedIncludedLetters = updatedIncludedLetters.replaceAll(guess.charAt(i),"")
            }

            if(currentLetterColor === "rgb(201, 180, 88)" && updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(currentLetterColor === "rgb(201, 180, 88)" && !updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIncludedLetters = updatedIncludedLetters + guess.charAt(i)
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(currentLetterColor === "rgb(120, 124, 126)" && guess.charAt(i) !== duplicateLetterInGuess){
                for(let j = 0; j < 5; j++){
                    if(updatedIndexTracker[j].includes("^")){
                        updatedIndexTracker[j] = updatedIndexTracker[j] + guess.charAt(i)
                    }
                }
            }
        }
    
        setIndexTracker(updatedIndexTracker)
        setIncludedLetters(updatedIncludedLetters)
        setDuplicateLettersInSolution(updatedDuplicateLettersInSolution)
        updateWordList(updatedIncludedLetters, updatedIndexTracker, updatedDuplicateLettersInSolution)
        setDuplicateLetterInGuess("")
    }

    const regexGenerator = (includedLettersString, positionArray) => {
        let expressionSectionOne = ""
        let expressionLastSection = ""

        for(let i = 0; i < includedLettersString.length; i++){
            expressionSectionOne = expressionSectionOne + `(?=.*${includedLettersString.charAt(i)}.*)`
        }

        for(let j = 0; j < 5; j++){
            if(positionArray[j].includes("^")){
                expressionLastSection = expressionLastSection + `[${positionArray[j]}]`
            }else{
                expressionLastSection = expressionLastSection + positionArray[j]
            }
        }

        let regex = new RegExp(`^${expressionSectionOne}(?=[a-z]{5})${expressionLastSection}$`)
        return regex
    }

    const updateWordList = (includedLettersString, positionArray, duplicateLettersInSolution) => {
        const regex = regexGenerator(includedLettersString, positionArray)
        let updatedWordList = []

        if(duplicateLettersInSolution !== ""){
            for( let i = 0; i < wordList.length; i++){
                if(wordList[i].indexOf(duplicateLettersInSolution) !== wordList[i].lastIndexOf(duplicateLettersInSolution) && regex.test(wordList[i])){
                    updatedWordList = [...updatedWordList, wordList[i]]
                }
            }  
            console.log(updatedWordList)
        }else{
            for( let i = 0; i < wordList.length; i++){
                if(regex.test(wordList[i])){
                    updatedWordList = [...updatedWordList, wordList[i]]
                }
            }
            console.log(updatedWordList)
        } 
        setWordList(updatedWordList)

        if(updatedWordList.length === 0){
            setIsError(true)
        }
    }

    const findNextGuess = () => {
        let nextGuess = ""
        let nextGuessWorstCase = 10000

        for(let i = 0; i < wordList.length; i++){
            let currentGuess = wordList[i]
            let worstCase = 0
            for(let j = 0; j < wordList.length; j++){
                let currentCase = findWordListLength(wordList[i], wordList[j])
                if(currentCase >= nextGuessWorstCase){
                    worstCase = currentCase
                    break
                }
                if(currentCase > worstCase){
                    worstCase = currentCase
                    continue
                }
            }
            if(worstCase < nextGuessWorstCase){
                nextGuessWorstCase = worstCase
                nextGuess = currentGuess
            }
        }
        setGuesses([...guesses, nextGuess])
        setWordList(wordList.filter((word) => {
           return word !== nextGuess
        }))
        checkForDuplicateLetters(nextGuess)
    }

    const findWordListLength = (guess, solution) => {
        let updatedIndexTracker = [...indexTracker]
        let updatedIncludedLetters = includedLetters

        for(let i = 0; i < 5; i++){
            if(guess.charAt(i) === solution.charAt(i) && updatedIndexTracker[i].includes('^')){
                updatedIndexTracker[i] = guess.charAt(i)
                updatedIncludedLetters = updatedIncludedLetters.replaceAll(guess.charAt(i),"")
            }

            if(guess.charAt(i) !== solution.charAt(i) && solution.includes(guess.charAt(i)) && !updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIncludedLetters = updatedIncludedLetters + guess.charAt(i)
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(guess.charAt(i) !== solution.charAt(i) && solution.includes(guess.charAt(i)) && updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(!solution.includes(guess.charAt(i))){
                for(let j = 0; j < 5; j++){
                    if(updatedIndexTracker[j].includes("^")){
                        updatedIndexTracker[j] = updatedIndexTracker[j] + guess.charAt(i)
                    }
                }
            }
        }
        
        let regex = regexGenerator(updatedIncludedLetters, updatedIndexTracker)

        let newWordListLength = wordList.filter((word) => {
            if(regex.test(word)) return word 
        }).length

        return newWordListLength
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
            findNextGuess()
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