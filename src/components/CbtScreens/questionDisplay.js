import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import ConfirmModal from '../utilities/confirmModal';
import { useNavigate } from 'react-router-dom';
import QuestionSkeleton from './questionSkeletons';
import instance from '../../Context/axiosConfig';
import {AuthContext} from "../../Context/AuthContext";


function QuestionComponent() {
  const { activeUser } = useContext(AuthContext)

  // Retrieve questions from local storage and initialize state
  const questionJson = localStorage.getItem('questions');
  const questions = JSON.parse(questionJson);
  const duration = localStorage.getItem('duration')
  const viewExplanation = localStorage.getItem('viewExplanation')
  const navigate = useNavigate()

  // State to manage the current subject and question number
  const [currentSubject, setCurrentSubject] = useState(Object.keys(questions)[0]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null)

  // Function to switch the current subject
  const switchSubject = (subject) => {
      setCurrentSubject(subject);
      setQuestionNumber(1)
      setSelectedOption(null);
    };
    
    const currentQuestion = questions[currentSubject][questionNumber -1];
  // Function to handle next and previous buttons
  const handleNextQuestion = () => {
    if (questionNumber < questions[currentSubject].length) {
      setQuestionNumber(questionNumber + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (questionNumber > 1) {    
      setQuestionNumber(questionNumber - 1);
      setSelectedOption(null);
    }
  };

  // Function to handle jumping to a specific question
  const onJumpToQuestion = (questionIndex) => {
    if (questionIndex >= 1 && questionIndex <= questions[currentSubject].length) {
      setQuestionNumber(questionIndex);
      setSelectedOption(null);
    }
  };

  // Function to handle selecting an option for the current question
  const handleOptionChange = (optionIndex) => {
      setSelectedOption(optionIndex);
      questions[currentSubject][questionNumber - 1].selectedOption = optionIndex;
      localStorage.setItem('questions', JSON.stringify(questions))
    };
    
    //saveExam

    const handleSaveExam =  useCallback(() => {
      const subjectScores = JSON.parse(localStorage.getItem('subjectScores'))
      const totalQuestions = localStorage.getItem('totalQuestions')
      const totalScore = localStorage.getItem('totalScores')
      const name = activeUser.username?.trim()
      const exam = localStorage.getItem('examBody')
      const examImage = localStorage.getItem('examImage')
      const questionJson = localStorage.getItem('questions');
      const questions = JSON.parse(questionJson);

      const newExamHistory = {
        username: name,
        exam: exam,
        image: examImage,
        totalScore: totalScore,
        totalQuestions: totalQuestions,
        subjectScores: subjectScores,
        questions: questions
    }

    // Make a POST request to create a new exam history record
    instance.post('/examHistory', newExamHistory)
      .then(response => {
        // Refresh the exam history list after creating a new record
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        localStorage.removeItem('examImage')
        
      })
      // eslint-disable-next-line
  }, [] )

    //handle submit
  const subjectScores = useMemo(() => ({}), []);
  const totalQuestionsRef = useRef(0);
  const totalScoreRef = useRef(0);

  const handleSubmit = useCallback(() => {
    const calculateSubjectScore = (subjectQuestions) => {
      let subjectScore = 0;
      for (const question of subjectQuestions) {
        if (question.selectedOption === parseInt(question.correctOption)) {
          subjectScore += 1;
        }
      }
      return subjectScore;
    };

    // logic for calculating scores and setting localStorage
    for (const subject in questions) {
      subjectScores[subject] = calculateSubjectScore(questions[subject]);
      totalQuestionsRef.current += questions[subject].length;
      totalScoreRef.current += subjectScores[subject];
    }
    localStorage.setItem('subjectScores', JSON.stringify(subjectScores));
    localStorage.setItem('totalQuestions', totalQuestionsRef.current);
    localStorage.setItem('totalScores', totalScoreRef.current);
    handleSaveExam()
    navigate('/resultTemp');
    
  }, [questions, subjectScores, navigate, handleSaveExam]);

    //timer
    const [time, setTime] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState()
    
    useEffect(() =>{
        let remainingTime = parseInt(duration) 
          const examTimer = () => {
            remainingTime = remainingTime - 1;
            localStorage.setItem('duration', remainingTime)
            let hours = Math.floor((remainingTime / (1 * 60 * 60)) % 24);
            let minutes = Math.floor((remainingTime / (1 * 60)) % 60);
        let seconds = Math.floor((remainingTime / 1) % 60);
        hours = hours <= 9 ? '0' + hours : hours
        minutes = minutes <= 9 ? '0' + minutes : minutes
        seconds = seconds <= 9 ? '0' + seconds : seconds
        if(!isNaN(remainingTime)){
          setTime(`${hours}:${minutes}:${seconds}`);
        }        
        if(remainingTime < 60 * 60) {
            setTimeRemaining('medium')
            }else if(remainingTime < 20 * 60){
               setTimeRemaining('low')
            }if(remainingTime <=  0){
              handleSubmit()
              clearInterval(timer)
            }
          }
          const timer = setInterval(examTimer, 1000);
          
          return () => {
            clearInterval(timer);
          };
          // eslint-disable-next-line
        }, [])
        
        //blink property
        const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    }, 500); 

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
    <QuestionSkeleton 
      timeRemaining={timeRemaining}
      questionNumber={questionNumber}
      handleCloseModal={handleCloseModal}
      onJumpToQuestion={onJumpToQuestion}
      ConfirmModal={ConfirmModal}
      handleOpenModal={handleOpenModal}
      handleNextQuestion={handleNextQuestion}
      isModalOpen={isModalOpen}
      currentSubject={currentSubject}
      handleSubmit={handleSubmit}
      handleOptionChange={!viewExplanation ? handleOptionChange : () => {}}
      handlePreviousQuestion={handlePreviousQuestion}
      questions={questions}
      currentQuestion={currentQuestion}
      selectedOption={selectedOption}
      switchSubject={switchSubject}
      time={time}
      isVisible={isVisible}
      viewExplanation = {viewExplanation}
    />

    </>
  );
}

export default QuestionComponent;
