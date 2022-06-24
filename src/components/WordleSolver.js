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

    const setBackgroundColor = (id, color) => {
        let currentLetter = document.getElementById(id)
        currentLetter.style.backgroundColor = color
    } 

    const handleGuessSubmit = (guess) => {
        setIsFirstGuessSubmitted(true)
        let updatedIndexTracker = [...indexTracker]
        let updatedIncludedLetters = includedLetters
        
        for(let i = 0; i < 5; i++){
            let currentLetterColor = document.getElementById(`${guess}-${i}`).style.backgroundColor

            if(currentLetterColor === "green" && indexTracker[i].includes("^")){
                updatedIndexTracker[i] = guess.charAt(i)
                updatedIncludedLetters = updatedIncludedLetters.replaceAll(guess.charAt(i),"")
            }

            if(currentLetterColor === "yellow" && updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(currentLetterColor === "yellow" && !updatedIncludedLetters.includes(guess.charAt(i))){
                updatedIncludedLetters = updatedIncludedLetters + guess.charAt(i)
                updatedIndexTracker[i] =  updatedIndexTracker[i] + guess.charAt(i)
            }

            if(currentLetterColor === "black"){
                for(let j = 0; j < 5; j++){
                    if(updatedIndexTracker[j].includes("^")){
                        updatedIndexTracker[j] = updatedIndexTracker[j] + guess.charAt(i)
                    }
                }
            }
        }
        setIndexTracker(updatedIndexTracker)
        setIncludedLetters(updatedIncludedLetters)
        updateWordList(updatedIncludedLetters, updatedIndexTracker)
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

    const updateWordList = (includedLettersString, positionArray) => {
        const regex = regexGenerator(includedLettersString, positionArray)
        
        let updatedWordList = []

        for( let i = 0; i < wordList.length; i++){
            if(regex.test(wordList[i])){
                updatedWordList = [...updatedWordList, wordList[i]]
            }
        }
        console.log(updatedWordList)
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

    useEffect(() => {
        if(isFirstGuessSubmitted){
            findNextGuess()
        }  
    },[indexTracker])

    return (
        <div>
            {guesses.map((guess) => (
                <div className= "word" key={guess}>
                    <div className="letter-container">
                        <div className="letter" id={`${guess}-0`}>
                            {guess.charAt(0)}
                        </div>
                        <div className="btn-container">
                            <button 
                                className="btn-green" 
                                onClick={() => setBackgroundColor(`${guess}-0`, "green")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-0`, "yellow")}
                            >
                            </button>
                            <button 
                                className="btn-black"
                                onClick={() => setBackgroundColor(`${guess}-0`, "black")}
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
                                onClick={() => setBackgroundColor(`${guess}-1`, "green")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-1`, "yellow")}
                            >
                            </button>
                            <button 
                                className="btn-black"
                                onClick={() => setBackgroundColor(`${guess}-1`, "black")}
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
                                onClick={() => setBackgroundColor(`${guess}-2`, "green")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-2`, "yellow")}
                            >
                            </button>
                            <button 
                                className="btn-black"
                                onClick={() => setBackgroundColor(`${guess}-2`, "black")}
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
                                onClick={() => setBackgroundColor(`${guess}-3`, "green")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-3`, "yellow")}
                            >
                            </button>
                            <button 
                                className="btn-black"
                                onClick={() => setBackgroundColor(`${guess}-3`, "black")}
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
                                onClick={() => setBackgroundColor(`${guess}-4`, "green")}
                            >
                            </button>
                            <button 
                                className="btn-yellow"
                                onClick={() => setBackgroundColor(`${guess}-4`, "yellow")}
                            >
                            </button>
                            <button 
                                className="btn-black"
                                onClick={() => setBackgroundColor(`${guess}-4`, "black")}
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