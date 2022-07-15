import WordList from "../WordList"

let wordList = WordList
let includedLetters = ""
let indexTracker = ["^", "^", "^", "^", "^"]
let duplicateLettersInSolution = ""
let duplicateLetterInGuess = ""

const submitGuess = (guess) => {
    checkForDuplicateLetters(guess)
    let duplicateLetterIndexes = []

    if(duplicateLetterInGuess){
        for(let i = 0; i < 5; i++){
            if(guess.charAt(i) === duplicateLetterInGuess){
                duplicateLetterIndexes.push(i)
            }
        }  
        let colorAtIndex0 = document.getElementById(`${guess}-${duplicateLetterIndexes[0]}`).style.backgroundColor
        let colorAtIndex1 = document.getElementById(`${guess}-${duplicateLetterIndexes[1]}`).style.backgroundColor

        if(colorAtIndex0 !== "rgb(120, 124, 126)" && colorAtIndex1 !== "rgb(120, 124, 126)" && duplicateLetterInGuess !== duplicateLettersInSolution){
            duplicateLettersInSolution = duplicateLettersInSolution + duplicateLetterInGuess
        }

        if(colorAtIndex0 === "rgb(120, 124, 126)" && colorAtIndex1 === "rgb(120, 124, 126)"){
            for(let j = 0; j < 5; j++){
                if(indexTracker[j].includes("^")){
                    indexTracker[j] = indexTracker[j] + duplicateLetterInGuess
                }
            }
        }

        if(colorAtIndex0 === "rgb(106, 170, 100)" && colorAtIndex1 === "rgb(106, 170, 100)"){
            includedLetters = includedLetters.replace(duplicateLetterInGuess, '')
        }
    }

    for(let i = 0; i < 5; i++){
        let currentLetterColor = document.getElementById(`${guess}-${i}`).style.backgroundColor

        if(currentLetterColor === "rgb(106, 170, 100)" && indexTracker[i].includes("^")){
            indexTracker[i] = guess.charAt(i)
            includedLetters = includedLetters.replaceAll(guess.charAt(i),"")
        }

        if(currentLetterColor === "rgb(201, 180, 88)" && includedLetters.includes(guess.charAt(i))){
            indexTracker[i] =  indexTracker[i] + guess.charAt(i)
        }

        if(currentLetterColor === "rgb(201, 180, 88)" && !includedLetters.includes(guess.charAt(i))){
            includedLetters = includedLetters + guess.charAt(i)
            indexTracker[i] =  indexTracker[i] + guess.charAt(i)
        }

        if(currentLetterColor === "rgb(120, 124, 126)" && guess.charAt(i) !== duplicateLetterInGuess){
            for(let j = 0; j < 5; j++){
                if(indexTracker[j].includes("^")){
                    indexTracker[j] = indexTracker[j] + guess.charAt(i)
                }
            }
        }
    } 
    console.log(`indexTracker:${indexTracker}`)
    console.log(`includedLetters:${includedLetters}`)
    console.log(`duplicateLettersInSolution:${duplicateLettersInSolution}`)  
}

const updateWordList = () => {
    const regex = regexGenerator(includedLetters, indexTracker)
    console.log(regex)
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
    } 
    wordList = updatedWordList
}

const regexGenerator = (includedLettersString, indexTrackerArray) => {
    let expressionSectionOne = ""
    let expressionLastSection = ""

    for(let i = 0; i < includedLettersString.length; i++){
        expressionSectionOne = expressionSectionOne + `(?=.*${includedLettersString.charAt(i)}.*)`
    }

    for(let j = 0; j < 5; j++){
        if(indexTrackerArray[j].includes("^")){
            expressionLastSection = expressionLastSection + `[${indexTrackerArray[j]}]`
        }else{
            expressionLastSection = expressionLastSection + indexTrackerArray[j]
        }
    }

    let regex = new RegExp(`^${expressionSectionOne}(?=[a-z]{5})${expressionLastSection}$`)
    return regex
}

const findNextGuess = () => {
    duplicateLetterInGuess = ""
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
    wordList = wordList.filter((word) => {
        return word !== nextGuess
    })
    return nextGuess
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
            duplicateLetterInGuess = guess.charAt(i)
            break
        }else{
            duplicateLetterInGuess = ""
        }
    }
    console.log(duplicateLetterInGuess)
}

export const Functions = {
    submitGuess,
    updateWordList,
    findNextGuess,
}