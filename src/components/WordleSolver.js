import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WordList from '../WordList'

function WordleSolver() {
    const [guesses, setGuesses] = useState(["raise"])
    const [indexTracker, setIndexTracker] = useState(["^", "^", "^", "^", "^"])
    const [includedLetters, setIncludedLetters] = useState("")
    const [wordList, setWordList] = useState(WordList)
    const [isFirstGuessSubmitted, setIsFirstGuessSubmitted] = useState(false)
    const [duplicateLetterInGuess, setDuplicateLetterInGuess] = useState("")
    const [duplicateLettersInSolution, setDuplicateLettersInSolution] = useState("")

    const setBackgroundColor = (id, color) => {
        let currentLetter = document.getElementById(id)
        currentLetter.style.backgroundColor = color
    } 

    const handleGuessSubmit = (guess) => {
        setIsFirstGuessSubmitted(true)
        let updatedIndexTracker = [...indexTracker]
        let updatedIncludedLetters = includedLetters
        let updatedDuplicateLettersInSolution = duplicateLettersInSolution
        let duplicateLetterIndexes = []

        if(duplicateLetterInGuess !== ""){
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

            if(currentLetterColor === "rgb(120, 124, 126)"){
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
        console.log(duplicateLettersInSolution)

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
    }

    // const findNextGuess = () => {
    //     let nextGuess = ""
    //     let nextGuessSum = 10000

    //     for(let i = 0; i < wordList.length; i++){
    //         let currentGuess = wordList[i]
    //         let sum = 0
    //         for(let j = 0; j < wordList.length; j++){
    //             sum = sum + findWordListLength(wordList[i], wordList[j])
    //         }
    //         if(sum < nextGuessSum){
    //             nextGuess = currentGuess
    //             nextGuessSum = sum
    //         }
    //         console.log(currentGuess,sum)
    //     }

    //     setGuesses([...guesses, nextGuess])
    //     setWordList(wordList.filter((word) => {
    //        return word !== nextGuess
    //     }))
    // }

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

    useEffect(() => {
        if(isFirstGuessSubmitted){
            findNextGuess()
        }  
    },[indexTracker])

    return (
        <div>
            <div className="title">Wordle Solver</div>
            {guesses.map((guess) => (
                <div className= "word" key={guess}>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-0`}>
                            {guess.charAt(0)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-0`, "rgb(106, 170, 100)")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-0`, "rgb(201, 180, 88)")}
                            >
                            </button>
                            <button 
                                className="btn-grey"
                                onClick={() => setBackgroundColor(`${guess}-0`, "rgb(120, 124, 126)")}
                            >
                            </button>
                        </div>
                    </div>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-1`}>
                            {guess.charAt(1)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-1`, "rgb(106, 170, 100)")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-1`, "rgb(201, 180, 88)")}
                            >
                            </button>
                            <button 
                                className="btn-grey"
                                onClick={() => setBackgroundColor(`${guess}-1`, "rgb(120, 124, 126)")}
                            >
                            </button>
                        </div>
                    </div>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-2`}>
                            {guess.charAt(2)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-2`, "rgb(106, 170, 100)")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-2`, "rgb(201, 180, 88)")}
                            >
                            </button>
                            <button 
                                className="btn-grey"
                                onClick={() => setBackgroundColor(`${guess}-2`, "rgb(120, 124, 126)")}
                            >
                            </button>
                        </div>
                    </div>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-3`}>
                            {guess.charAt(3)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-3`, "rgb(106, 170, 100)")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-3`, "rgb(201, 180, 88)")}
                            >
                            </button>
                            <button 
                                className="btn-grey"
                                onClick={() => setBackgroundColor(`${guess}-3`, "rgb(120, 124, 126)")}
                            >
                            </button>
                        </div>
                    </div>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-4`}>
                            {guess.charAt(4)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-4`, "rgb(106, 170, 100)")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-4`, "rgb(201, 180, 88)")}
                            >
                            </button>
                            <button 
                                className="btn-grey"
                                onClick={() => setBackgroundColor(`${guess}-4`, "rgb(120, 124, 126)")}
                            >
                            </button>
                        </div>
                    </div> 
                    <button 
                        className="submit-guess"
                        onClick={() => handleGuessSubmit(guess)}
                    >
                        Submit Guess
                    </button>           
                </div>
            ))}
        </div>
        
        
    );
}

export default WordleSolver;