import React, { useState, useEffect } from "react";
import configData from "../../config.json";
import { useNavigate } from "react-router-dom";

const QuestionSkeleton = (props) => {
  const {
  timeRemaining,
  questionNumber,
  handleCloseModal,
  onJumpToQuestion,
  ConfirmModal,
  handleOpenModal,
  handleNextQuestion,
  isModalOpen,
  currentSubject,
  handleSubmit,
  handleOptionChange,
  handlePreviousQuestion,
  questions,
  currentQuestion,
  selectedOption,
  switchSubject,
  time,
  isVisible,
  viewExplanation
  } = props
  const navigate = useNavigate()
  const getLetterFromIndex = (index) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return letters[index] || ''; // Handle indices beyond 'z'
  };

  //count questions
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const calculateCounts = () => {
      let totalCount = 0;
      for (const key in questions) {
        if (questions.hasOwnProperty(key)) {
          const array = questions[key];
          totalCount += array.length;
        }
      }
      setCounts(totalCount);
    };
    
    calculateCounts();
  }, [questions]);


  const numberBackground = (number) => {
    if(viewExplanation){
      if(questions[currentSubject][number-1]?.selectedOption === parseInt(questions[currentSubject][number-1]?.correctOption)){
        return 'green'
      }else{
        return 'red'
      }
    }else if(questionNumber === number){
      return configData.AppColor
    }else if(questions[currentSubject][number-1]?.selectedOption ||  
      questions[currentSubject][number-1]?.selectedOption === 0){
        return 'lightblue';
      }else{
        return '#fff'
      }
    }
    // const explanationBackground = ''

    return ( <>
    <div className="question-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', margin: '0 auto', padding: '5px' }}>
      
    {!viewExplanation && <div style={{
      alignSelf: 'end', 
      fontSize: '25px', 
      fontWeight: '600',
      padding: '10px',
      color: timeRemaining === 'medium' ? 'orange' : timeRemaining === 'low' ? 'red' :'green',
      opacity: !isVisible && timeRemaining === 'low' ? 0 : 1
      }}>{time}</div>}
    <div className="subject-buttons">


      {/* Display subject buttons */
      Object.keys(questions).map((subject) => (
        <button
          key={subject}
          style={{
            background: currentSubject === subject ? configData.AppColor : 'lightblue',
            color: 'white',
            borderRadius: '5px',
            border: 'none',
            padding: '5px 20px',
            margin: '5px',
            cursor: 'pointer',
          }}
          onClick={() => switchSubject(subject)}
        >
          {subject}
        </button>
      ))}
    </div>
    <div className="question-content">
      <p
        className="current-question"
        style={{
          padding: '10px',
          fontWeight: 'bold',
        }}
      >
        Question {questionNumber} - {currentSubject}
      </p>
      {currentQuestion?.passage ? <p>{currentQuestion?.passage}</p> : ''}
      <p>{currentQuestion?.question}</p>
        {currentQuestion?.options.map((option, index) => (
          <li
            key={index}
            style={{
              padding: '5px',
              listStyle: 'none',
            }}
          >
            <label>
              <input
                type="radio"
                name={`question-${questionNumber}-options`}
                value={index}
                checked={index === currentQuestion.selectedOption || index === selectedOption}
                onChange={() => handleOptionChange(index)}
              />
              {option}
            </label>
          </li>
        ))}
      <div className="navigation-buttons">
        <button
          style={{
            padding: '5px 20px',
            background: configData.AppColor,
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            border: '1px solid #ccc',
          }}
          onClick={handlePreviousQuestion}
          disabled={questionNumber === 1}
        >
          {'Previous'}
        </button>
        <button
          style={{
            padding: '5px 20px',
            background: configData.AppColor,
            color: 'white',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginLeft: '5px',
            cursor: 'pointer',
          }}
          onClick={handleNextQuestion}
          disabled={questionNumber === questions[currentSubject].length}
        >
          {'Next'}
        </button>
      </div>
      <div className="question-numbers" style={{ marginTop: '10px' }}>
        {/* Create clickable question number boxes */
        Array.from({ length: questions[currentSubject].length }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            style={{
              padding: '10px 20px',
              background: numberBackground(number),
              color: questionNumber === number ? 'white' : 'black',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={() => onJumpToQuestion(number)}
          >
            {number}
          </button>
        ))}
        {viewExplanation ? <>
        <p style={{
            fontSize: '20px', 
        }}>{`Correct option: ${getLetterFromIndex(currentQuestion.correctOption).toLocaleUpperCase()}`}</p>
        <p style={{
          color: '#ccc', 
          fontSize: '20px', 
          marginTop: '5px'
          }}>Explanation</p>
        <p style={{fontWeight: 600}}>{currentQuestion.explanation}</p>
        </> : ''}
      </div>
      {viewExplanation ? 
      <button style={{
        background: configData.AppColor,
        padding: '3px',
        borderRadius: '5px',
        color: '#fff',
        marginRight: '2px'
        }}
        onClick={() => {
          navigate('/addStory')
          localStorage.setItem('question', JSON.stringify(currentQuestion))
      }}
        >Post Question</button> : ''}
      {viewExplanation ? 
      <button style={{
        background: 'green',
        padding: '3px',
        borderRadius: '5px',
        color: '#fff'
        }}
        onClick={() => {
          localStorage.removeItem('viewExplanation')
          navigate('/jamb')
      }}
        >New Quiz</button>
        :
        <button style={{
        background: 'red', 
        color: 'white', 
        padding: '5px 10px',
        borderRadius: '5px',
        marginTop: '20px',
        border: 'none'
        }} onClick={handleOpenModal}>
          {questionNumber === counts ? 'Submit' : 'Quit Exam'}
        </button>}
        <ConfirmModal 
        isOpen={isModalOpen}
        onConfirm={handleSubmit}
        onCancel={handleCloseModal}
        text= {`Are you sure you want to ${questionNumber === counts ? 'Submit' : 'Quit Exam'}?`}
        />
    </div>
  </div> 
          </>
  );
}
 
export default QuestionSkeleton;