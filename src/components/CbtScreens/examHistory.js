import React, { useState, useEffect, useContext, useCallback } from 'react';
import instance from '../../Context/axiosConfig';
import "../../Css/Home.css";
import noContent from '../../img/no_content_yet.jpeg'
import {AuthContext} from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ConfirmModal from '../utilities/confirmModal';
import Loader from "../GeneralScreens/Loader";
import Pagination from '../GeneralScreens/Pagination';


const ExamHistoryList = () => {
  const [examHistories, setExamHistories] = useState([]);
  const { activeUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const name = activeUser.username
  const [message, setMessage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [currExam, setCurrExam] = useState({})
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const getExamHistory = useCallback( async(pageNumber) => {
    setIsLoading(true)
    // Fetch all exam history records
    await instance.get(`/examHistory?page=${pageNumber}&username=${name}`)
      .then(response => {
        setExamHistories(response.data.examHistory);
        setIsLoading(false)
        console.log(response.data.examHistory);
        setPages(response?.data?.maxPages)
      })
      .catch(error => {
          setMessage('Error fetching exam histories: Network error');
          setTimeout(() => setMessage(null), 2000)
          setIsLoading(false)
        });
  }, [name])
  useEffect(() => {
      getExamHistory(page)
    }, [getExamHistory, page]); // Empty dependency array ensures the effect runs only once on component mount

  //delete an exam
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleDelete = async(id) => {
        try {
          // Make a DELETE request to delete the exam history by ID
          const response = await instance.delete(`/examHistory/${id}`);
    
          // Check if the request was successful
          if (response.status === 200) {
            setMessage('Exam history deleted successfully');
            getExamHistory()
            setTimeout(() => setMessage(null), 2500)
            // You may want to update your local state or do other actions after deletion
          } else {
            setMessage('Failed to delete exam history');
            setTimeout(() => setMessage(null), 2500)
          }
        } catch (error) {
          setMessage('Network Error');
          setTimeout(() => setMessage(null), 2500)
        }
        setModalOpen(false);
        
  }
  const handleDeleteSelection = (curr) => {
    setCurrExam(curr)
    console.log(curr);
    handleOpenModal()
    console.log(examHistories);
  }
  const examImageMap = {
    utme: require('../../img/jambImg.jpg'),
    topic: require('../../img/topic.jpg'),
    custom: require('../../img/custom.jpg'),
  };

  const examImg = examHistories.map(exam => examImageMap[exam.exam])

  const handleShowResult = (exam, subjectScores, totalQuestions, totalScore, questions) => {
    localStorage.setItem('examBody', exam)
    localStorage.setItem('subjectScores', JSON.stringify(subjectScores))
    localStorage.setItem('totalQuestions', totalQuestions)
    localStorage.setItem('totalScores', totalScore)
    localStorage.setItem('questions', JSON.stringify(questions))
    navigate('/resultTemp')
}



  return (
    <>
    {message && <div style={{
        position: 'absolute',
        zIndex: '1000',
        opacity: 0.4,
        background: '#333',
        margin: '5px',
        padding: '5px',
        color: '#fff',
        borderRadius: '5px',
        right: '0'
      }}><p>{message}</p></div>}
      {isLoading? <Loader /> : ""}
    <div className="story-card-wrapper" style={{minHeight: '0px', flexDirection: 'column', display: 'flex'}}>
      <h2 style={{
        color: '#ccc',
        margin: '10px'
    }}>Exam History List</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {examHistories.length >=1 ? examHistories.map((examHistory, index) => (
        <>
          <li key={examHistory._id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', margin: '5px', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <img src={examHistory?.image || examImg[index]} alt= 'exam_img' style={{ 
              width: '80px', 
              height: '80px', 
              marginRight: '10px', 
              borderRadius: '50%', 
              cursor: 'pointer'
            }} 
            onClick={() => {
                handleShowResult(examHistory.exam, examHistory.subjectScores, examHistory.totalQuestions, examHistory.totalScore, examHistory.questions)
              }}/>
          
          <div style={{ flex: '1' }} >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>User: {examHistory.username}</div>
                <RiDeleteBin6Line 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleDeleteSelection(examHistory)}/>
                
                <ConfirmModal 
                    isOpen={isModalOpen}
                    onConfirm={() => handleDelete(currExam._id)}
                    onCancel={handleCloseModal}
                    text = {`Are you sure you want to delete this exam record?`
                  }
                    />
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Exam: {examHistory.exam}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>Total Score: {examHistory.totalScore} / {examHistory.totalQuestions}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Date: {new Date(examHistory.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </li>
              </>
        
        )) : isLoading? '' 
        : 
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5% auto', padding: '10px', textAlign: 'center'}}>
            <img src={noContent} alt='no content' style={{
                width: '50%',
                height: 'auto'
            }}/>
            <h4 style={{color: '#ccc'}}>you have not taken any exams at the moment</h4>
            <button style={{
                color: 'green', 
                textDecoration: 'underLine',
                background: 'none',
                border: 'none',
                width: '50%', 
                padding: '15px'
                }} onClick={() => {navigate('/')}}>Go home</button>
        </div>

        }
      </ul>
      <Pagination page={page} pages={pages} changePage={setPage} /> 
    </div>
                </>
  );
};

export default ExamHistoryList;
