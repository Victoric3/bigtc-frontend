import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { availableSubjects } from '../examPatterns/subjectCombination';
import { AuthContext } from '../../Context/AuthContext';
import {
    error, 
    success
} from '../examPatterns/styleModules'
import {jambLogo} from '../examPatterns/styleModules'
import topic from '../../img/topic.jpg'
import { Helmet } from 'react-helmet';
import configData from '../../config.json'
import axios from 'axios';



const TopicByTopicExam = () => {
  let questions = {};
  const { config } = useContext(AuthContext)
    const [topics, setTopics] = useState([])
    const [errorData, setError] = useState(false)
    const [successData, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
    subject: 'English',
    difficulty: 'medium',
    topic: 'passage',
    questions: 2,
    timed: false,
    time: 30,
    examBody: 'joint admission and matriculation board',
  });
  localStorage.setItem('examBody', 'topic')
  const navigate = useNavigate();


  const handleInputChange = async(e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    };

    questions[formData.subject.toLowerCase()] = [];


    useEffect(() => {
        const fetchTopics = async () => {
          try {
            const subjectDataModule = await import(`../examPatterns/topics/${formData.subject.toLowerCase()}Topics`);
            setTopics(subjectDataModule.default);

          } catch (error) {
            console.error('Error loading topics:', error);
          }
        };
    
        fetchTopics();
      }, [formData.subject]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
      [name]: checked,
    }));
  };
  

  const startTopicByTopicExam = async () => {
    setLoading(true)
    try{
        const form = {
            examBody: formData.examBody,
            topicCombinations: [{
                course: formData.subject || "english language",
                difficulty: formData.difficulty,
                topic: formData.topic || 'passage',
                questions: parseInt(formData.questions),
                type: "comprehension"
            }]
        }
        setError(null)
        setSuccess('getting questions... this may take a minute')
        const response = await axios.post(`${!configData.dev ? configData.ALPHALEARN3_BASEURL : 'http://localhost:8000'}/api/v1/questions/McqQuestion/${configData.API_USERNAME}`, form, config);
        // const response = await instance.post('/question/getQuestion', form, config)
        const { data } = response
        
        if(response.status === 200){
          setLoading(false)

          //get comprehension passages
          const englishComprehensionQuestions = data.examSession.filter(question => 
            question?.course?.toLowerCase() === 'english language' && question.type?.toLowerCase() === 'comprehension'
            );
            
            //loop and transform questions
            englishComprehensionQuestions?.forEach((el) => {
              const compQuestions = el.questions
              const compPassage = el?.passage
              compQuestions?.forEach(question => {
                question.passage = compPassage
                questions['english'].push(question)
              })
            })
            
            data.examSession.forEach(el => {
              if (el?.type?.toLowerCase() !== 'comprehension') {
                questions[el.course?.toLowerCase()]?.push(el);
              }
            });
            localStorage.setItem('questions', JSON.stringify(questions))
            localStorage.removeItem('viewExplanation')
            setError(null)
          setSuccess('you will be redirected to the exam page')
          setTimeout(() => {
            if(formData.timed){
              const duration = formData.time * 60
              localStorage.setItem('duration', duration)
            }else{
              localStorage.removeItem('duration')
            }
            navigate('/questionDisplay')
          }, 500)

        }
      }catch(error){
        setLoading(false)
        setSuccess(null)
        
        if(error?.response?.status === 400){
          setSuccess(null)
          setError('an errror occured while fetching questions')
          setTimeout(() => setError(null), 5000)
        }else if(error?.response?.status === 401){
          setSuccess(null)
          setError('you are not authorized to take this exam, try a diffrent exam or relogin')
          setTimeout(() => setError(null), 5000)
        }else if(error.response.status === 429){
          setTimeout(() => setError(null), 5000)
          setError(`slow down a bit!, press start exam in a few seconds`)
        }else if(error.response.status === 500){
          setTimeout(() => setError(null), 5000)
          setError('Network Error')
        }

      }
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  },[errorData, successData])

  return (
    <>
    <Helmet>
        <title>{`Topic By Topic Mode | ${configData.Name}`}</title>
        <meta name="description" content={
          `If you want to learn in a systematic way, 
          you can use the "Topic-by-Topic" mode. 
          This mode will show you all the questions that are related to a specific topic. 
          You can choose the subject that interests you and answer the questions one by one. 
          This way, you can cover all the important aspects of the topic and deepen your understanding.
          `} />
      </Helmet>
          <div style={{ maxWidth: '600px', margin: '20px auto', padding: '5px' }}>
          {errorData? <div style={error}>{errorData}</div> : ''}
          {successData ? <div style={success}>{successData}</div> : ''}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <img src={topic} alt='jamb logo' style={jambLogo} />
     <h1>Topic By Topic</h1>
    </div>
      <p>
        If you want to learn in a systematic way, 
        you can use the "Topic-by-Topic" mode. 
        This mode will show you all the questions that are related to a specific topic. 
        You can choose the subject that interests you and answer the questions one by one. 
        This way, you can cover all the important aspects of the topic and deepen your understanding.
      </p>
      <form style={{ 
        margin: '20px 5px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <label style={{
          gap: '5px',
          display: 'flex',
            flexDirection: 'column'
        }}>
          Select Subject:
          <select name="subject" value={formData.subject} onChange={handleInputChange}
          style={{
            width: '50%'
          }}
          >
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
          Topic:
          <select name="topic" value={formData.topic} onChange={handleInputChange}
          style={{
            width: '50%'
          }}>
          {topics?.map((topic) => (
              <option key={topic} value={topic}>
                {topic} 
              </option>
            ))}
          </select>
        </label>
        <label style={{
            display: 'flex',
            flexDirection: 'column'
            }}>
          Number of Questions:
          <input
            type="number"
            name="questions"
            value={formData.questions}
            min={5}
            max={200}
            onChange={handleInputChange}
            style={{
                width: '50%'
              }}
          />
        </label>

        <label style={{
            gap: '5px',
            display: 'flex',
            flexDirection: 'column'
          }}>
          Difficulty:
          <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}
          style={{
            width: '50%'
          }}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Timed
          <input
            type="checkbox"
            name="timed"
            checked={formData.timed}
            onChange={handleCheckboxChange}/>
        </label>

        {formData.timed && (
          <label>
            Time (in minutes):
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              />
          </label>
        )}

        <button type="button" onClick={startTopicByTopicExam} style={{ 
            marginTop: '20px',
            width: '100px',
            padding: '8px',
            alignSelf: 'flex-end',
            borderRadius: '5px',
            background: loading? 'lightBlue' : 'blue',
            color: '#fff',
            border: 'none'
            }}>
          Start Exam
        </button>
      </form>
    </div>
    </>
  );
};

export default TopicByTopicExam;
