const submitGuess = (guess, indexTracker, includedLetters, duplicateLettersInSolution, duplicateLetterInGuess) => {
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
    return {updatedIndexTracker, updatedIncludedLetters, updatedDuplicateLettersInSolution}    
}

const updateWordList = (wordList, includedLettersString, positionArray, duplicateLettersInSolution) => {
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
    } 
    return updatedWordList
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

const findNextGuess = (wordList, indexTracker, includedLetters) => {
    let nextGuess = ""
    let nextGuessWorstCase = 10000

    for(let i = 0; i < wordList.length; i++){
        let currentGuess = wordList[i]
        let worstCase = 0
        for(let j = 0; j < wordList.length; j++){
            let currentCase = findWordListLength(wordList[i], wordList[j], indexTracker, includedLetters, wordList)
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
    return nextGuess
}

const findWordListLength = (guess, solution, indexTracker, includedLetters, wordList) => {
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



export const Functions = {
    submitGuess,
    updateWordList,
    findNextGuess,
}