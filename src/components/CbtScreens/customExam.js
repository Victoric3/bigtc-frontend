import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { availableSubjects, availableExams } from '../examPatterns/subjectCombination';
import { AuthContext } from '../../Context/AuthContext';
import { error, success } from '../examPatterns/styleModules';
import {jambLogo} from '../examPatterns/styleModules'
import custom from '../../img/custom.jpg'
import configData from '../../config.json'
import axios from 'axios';

const CustomExam = () => {
    const { config } = useContext(AuthContext);
      const navigate = useNavigate();
    const [errorData, setError] = useState(false);
    const [successData, setSuccess] = useState(false);
    const [topics, setTopics] = useState({})
    const [loading, setLoading] = useState(false)


    localStorage.setItem('examBody', 'custom')
    const getTopicsForSubject = (subject) => {
      // You can implement the logic to fetch topics for each subject here
      try {
        const subjectDataModule = require(`../examPatterns/topics/${subject?.toLowerCase()}Topics`);
        return subjectDataModule.default;
      } catch (error) {
        console.error('Error loading topics:', error);
        return [];
      }
    };
      const [formData, setFormData] = useState({
        examBody: availableExams[0],
        subjects: [{ 
          subject: availableSubjects[0], 
          topics: [], 
        }],
        questions: 1,
        difficulty: 'medium',
        timed: false,
        time: 30,
    });
    formData.subjects.map((subject, index) => subject.topics = getTopicsForSubject(subject.subject))

    //get topicCombinations
    const [selectedTopics, setSelectedTopics] = useState([]);
    const handleTopicChange = (e, topic, subject) => {
      const isChecked = e.target.checked;
  
  setSelectedTopics((prevSelectedTopics) => {
    if (isChecked) {
      // Add the topic to the array if it's not already present
      if (!prevSelectedTopics.includes(topic)) {
        return [...prevSelectedTopics, topic];
      }
    } else {
      // Remove the topic from the array
      return prevSelectedTopics.filter((selectedTopic) => selectedTopic !== topic);
    }

    // If no change is needed, return the current array
    return prevSelectedTopics;
  });
  setTopics((prevTopics) => {
    const newTopics = { ...prevTopics };

    if (isChecked) {
      // If the subject doesn't exist in the object, create an array to store topics
      if (!newTopics[subject]) {
        newTopics[subject] = [];
      }

      // Add the topic to the array for the corresponding subject
      if (!newTopics[subject].includes(topic)) {
        newTopics[subject].push(topic);
      }
    } else {
      // Remove the topic from the array for the corresponding subject
      if (newTopics[subject]) {
        newTopics[subject] = newTopics[subject].filter((t) => t !== topic);
      }
    }

    return newTopics;
  });
};


  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
  
    // If the input is not inside the subjects array
    if (name === 'time') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      // If the input is part of the subjects array
      const newSubjects = [...formData.subjects];
      newSubjects[0][name] = value; // Assuming the time input is associated with the first subject
      setFormData((prevFormData) => ({
        ...prevFormData,
        subjects: newSubjects,
      }));
    }
  };

  const startCustomExam = async () => {
    setLoading(true)
    try {
      const topicCombinations = [];
      const questions = {};
      Object.keys(topics).forEach((subject) => {
        const subjectTopics = topics[subject];
        questions[subject.toLowerCase()] = [];

        subjectTopics.forEach((topic) => {
          const combination = {
            course: subject,
            difficulty: formData.difficulty,
            questions: parseInt(formData.questions),
            type: "comprehension", // Adjust as needed based on your data structure
            topic: topic,
          };

          topicCombinations.push(combination);
        });
      });
      const form = {
        examBody: formData.examBody,
        topicCombinations: topicCombinations
      };
      if(form.topicCombinations.length <= 0){
        return setError('please select atleast one topic')
      }
      setError(null);
      setSuccess('Getting questions... This may take a minute');

      // const response = await fetch(`${configData.ALPHALEARN3_BASEURL}/api/v1/questions/McqQuestion/${configData.API_USERNAME}`, {
      //   method: 'POST',
      //   body: JSON.stringify(form),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const response = await axios.post(`${configData.ALPHALEARN3_BASEURL}/api/v1/questions/McqQuestion/${configData.API_USERNAME}`, form, config);
      const { data } = response
      if (response.status === 200) {
        setLoading(false)
        const shuffleArray = (array) => {
          for (let i = array?.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        console.log(data);
        shuffleArray(data.examSession)
        
        //get comprehension passages
        const englishComprehensionQuestions = data.examSession.filter(question => 
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
          
          data.examSession.forEach(el => {
            if (el?.type?.toLowerCase() !== 'comprehension') {
              // If it's not a comprehension question, just add it to the questions object
              questions[el.course?.toLowerCase()]?.push(el);
            }
          });

          localStorage.setItem('questions', JSON.stringify(questions));
          localStorage.removeItem('viewExplanation');
          setError(null);
          setSuccess('You will be redirected to the exam page');
          setTimeout(() => {
          if(formData.timed){
          const duration = formData.time * 60;
          localStorage.setItem('duration', duration);
          }else{
            localStorage.removeItem('duration')
          }
          navigate('/questionDisplay');
        }, 2000);
      } 
    } catch (error) {
      setLoading(false)
      setSuccess(null)
      if(error.response.status === 400){
        setError('an errror occured while fetching questions')
        setTimeout(() => setError(null), 5000)
        }else if(error.response.status === 401){
          setError('you are not authorized to take this exam, try a diffrent exam or relogin')
          setTimeout(() => setError(null), 5000)
        }else if(error.response.status === 429){
          setError(`slow down a bit!, press start exam in a few seconds`)
          setTimeout(() => setError(null), 5000)
        }else if(error.response.status === 500){
          setError('Network Error')
          setTimeout(() => setError(null), 5000)
        }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  },[errorData, successData])
  
  return (
    <>
    <Helmet>
        <title>{`Custom Exam | ${configData.Name}`}</title>
        <meta name="description" content={
          `Want to create your own exams based on your preferences? 
        Try the "Custom Exam" mode and choose the questions, 
        topics, and difficulty levels that suit you best. 
        It's a great way to test yourself on what you really want to learn.`} />
      </Helmet>
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '5px' }}>
        {errorData ? <div style={{ ...error, marginTop: '10px' }}>{errorData}</div> : ''}
        {successData ? <div style={{ ...success, marginTop: '10px' }}>{successData}</div> : ''}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <img src={custom} alt='jamb logo' style={jambLogo} />
        <h1>Custom Exam</h1>
        </div>
        <p>
        Want to create your own exams based on your preferences? 
        Try the "Custom Exam" mode and choose the questions, 
        topics, and difficulty levels that suit you best. 
        It's a great way to test yourself on what you really want to learn.        </p>
        <form style={{ margin: '20px 5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {formData.subjects.map((subject, index) => (
            <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px' 
                }}>
              <label style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                Select Exam:
                <select
                  name="subject"
                  value={formData.examBody}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{
                    width: '50%'
                  }}
                >
                  {availableExams.map((availableExam) => (
                    <option key={availableExam} value={availableExam}>
                      {availableExam}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                Select Subject:
                <select
                  name="subject"
                  value={subject?.subject}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{
                    width: '50%'
                  }}
                >
                  {availableSubjects.map((availableSubject) => (
                    <option key={availableSubject} value={availableSubject}>
                      {availableSubject}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    Topics:
                        {subject?.topics?.map((topic) =>
                          <label>
                            <input
                                type="checkbox"
                                name={`topic-${topic}`}
                                value={topic}
                                checked={selectedTopics.includes(topic)}
                                onChange={(e) => handleTopicChange(e, topic, subject?.subject)}
                                />
                            {topic}
                        </label>)}
                </label>
            </div>
          ))}
          
              <label style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                Number of Questions per Topic:
                <input
                  type="number"
                  name="questions"
                  value={formData.questions}
                  min={1}
                  max={100}
                  onChange={(e) => setFormData((prevFormData) => ({
                    ...prevFormData,
                    questions: e.target.value,
                  }))}
                  style={{ width: '50%' }}
                />
              </label>
          <label style={{ gap: '5px', display: 'flex', flexDirection: 'column' }}>
            Difficulty:
            <select name="difficulty" value={formData.difficulty} 
            onChange={(e) =>{
              setFormData((prevFormData) => ({
                ...prevFormData,
                difficulty: e.target.value,
              }))
            }
            } 
            style={{ width: '50%' }}>
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
            onChange={handleCheckboxChange}
            style={{
                marginLeft: '5px'
              }}
            />
            
        </label>

        {formData.timed && (
          <label>
            Time (in minutes):
            <input
              type="number"
              name="time"
              value={formData.time}
              onChange={(e) => handleInputChange(e)}
            />
          </label>
        )}

          <button
            type="button"
            onClick={startCustomExam}
            style={{
              marginTop: '20px',
              width: '100px',
              padding: '5px',
              alignSelf: 'flex-end',
              borderRadius: '5px',
              background: loading? '#ff7f7f' : 'red',
              color: '#fff'
            }}
          >
            Start Exam
          </button>
        
        </form>
      </div>
    </>
  );
};

export default CustomExam;
