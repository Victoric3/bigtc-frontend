import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import instance from '../../Context/axiosConfig';
import { AuthContext } from '../../Context/AuthContext';
import Loader from '../GeneralScreens/Loader';
import '../../Css/allExams.css';
import { Helmet } from 'react-helmet';
import configData from '../../config.json'


const ExamPage = () => {
    const navigate = useNavigate()
    const [exam, setExam] = useState({})
    const [loading, setLoading] = useState()
    const { config } = useContext(AuthContext);
    const slug = useParams().slug
    const questions = {}
    
    const handlefetchExam = useCallback(async () => {
        try{
            setLoading(true)

            const response = await instance.get(`/exam/getExam/${slug}`, config)

            const exam = response?.data?.exam

            setExam(exam)
            localStorage.setItem('examBody', exam?.name)
            localStorage.setItem('examImage', exam?.image)
            
        }catch(error){
            console.log(error);
     
        } finally{
            setLoading(false)
        }
    }, [config, slug])

    useEffect(() => {handlefetchExam()}, [handlefetchExam])

    const startExam = () => {
        const shuffleArray = (array) => {
          for (let i = array?.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        shuffleArray(exam?.questions)
        
        //get comprehension passages
        const englishComprehensionQuestions = exam.questions.filter(question => 
          question?.course?.toLowerCase() === 'english language' && question.type?.toLowerCase() === 'comprehension'
          );
          
          //loop and transform questions
          englishComprehensionQuestions.forEach((el) => {
            const compQuestions = el.questions
            const compPassage = el.passage
            compQuestions.forEach(question => {
              question.passage = compPassage
              questions['english'].push(question)
            })
          })
          
          exam.questions.forEach(el => {
            if (el?.type?.toLowerCase() !== 'comprehension') {
              // If it's not a comprehension question, just add it to the questions object
              const courseKey = el.course?.toLowerCase();
              questions[courseKey] = questions[courseKey] || [];
              questions[courseKey].push(el);

            }
          });

          localStorage.setItem('questions', JSON.stringify(questions));
          localStorage.removeItem('viewExplanation');
          
          setTimeout(() => {
          if(parseInt(exam?.duration)){
          const duration = parseInt(exam?.duration) * 60;
          localStorage.setItem('duration', duration);
          }else{
            localStorage.removeItem('duration')
          }
          navigate('/questionDisplay');
        }, 2000);
    };

    return (
        <>
        <Helmet>
        <title>{`${exam?.name} | ${configData.Name}`}</title>
        <meta name="description" content={exam?.description?.slice(0, 150)} />
      </Helmet>
        {loading
            ? 
            <Loader />
            :
        <div className='all-exam-details-wrapper'>
            <p style={{color: '#ccc', alignSelf: 'flex-end'}} >date: {new Date(exam?.date).toLocaleDateString()}</p>
            <img className='all-exam-details-image' src={exam?.image} alt={exam?.name} />
            <h1 className='all-exam-details-title'>{exam?.name?.toUpperCase()}</h1>
            <p><strong>Duration:</strong> {exam?.duration} minutes</p>
            <p><strong>Difficulty:</strong> {exam?.difficulty}</p>
            <p><strong>Category:</strong> {exam?.category}</p>
            <p><strong>Grade:</strong> {exam?.grade}</p>
            <p><strong>Questions:</strong> {exam?.questions?.length}</p>
            <p>{exam?.description}</p>
            <button onClick={startExam} className='all-exam-details-submit-button'>Start Exam</button>
        </div>
    }
    </>
    );
};

export default ExamPage;
