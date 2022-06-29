import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'

function InstructionsModal({isModalOpen, setIsModalOpen}) {
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }
    return (
        <div
            className={isModalOpen ? "modal" : "display-none"}
        >
            <FontAwesomeIcon 
                icon={faXmarkCircle}     
                className = "question-icon"
                onClick={handleCloseModal}
            />
            <h3>How This Solver Works</h3>
            <p>Think of a five letter word and the solver will guess it!</p>
            <p>To use the solver: mark letters in the correct place green, letters that are included in the word but in the wrong place yellow, and letters that aren't included in the word grey.</p>
            <p>This algorithm uses the word "RAISE" as it's first guess</p>
            <p>So if you want to guess the word "RUSTY" you would mark the letters like this:</p>
            <div className="sample-word">
                <div className="letter" style={{backgroundColor: "rgb(106, 170, 100)"}}>R</div>
                <div className="letter" style={{backgroundColor: "rgb(120, 124, 126)"}}>A</div>
                <div className="letter" style={{backgroundColor: "rgb(120, 124, 126)"}}>I</div>
                <div className="letter" style={{backgroundColor: "rgb(201, 180, 88)"}}>S</div>
                <div className="letter" style={{backgroundColor: "rgb(120, 124, 126)"}}>E</div>
            </div>
            

            
        </div>
    );
}

export default InstructionsModal;