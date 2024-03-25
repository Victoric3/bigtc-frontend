import React, {useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios'; 
import jamb from '../../img/jambImg.jpg'
import { subjectCombinations, availableSubjects } from '../examPatterns/subjectCombination';
import { 
  buttonStyle, 
  paragraphStyle, 
  headerWrapper, 
  jambLogo, 
  headerStyle, 
  wrapperStyle,
  error,
  success
} from '../examPatterns/styleModules'
// import { biologyPreset1, physicsPreset1, chemistryPreset1 } from '../examPatterns/jambSets/jambSet1';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import configData from '../../config.json'


const JambUTMEExam = () => {
  const { config } = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedSubjects, setSelectedSubjects] = useState(['English']);
  localStorage.setItem('examBody', 'utme')
  const [errorData, setError] = useState(null)
  const [successData, setSuccess] = useState(null)
  // Function to handle subject selection
  const handleSubjectSelection = (subject) => {
    // If subject is not already selected, add it to the list
    if (!selectedSubjects.includes(subject)) {
      // Limit to 3 subjects
      if (selectedSubjects.length < 4) {
        setSelectedSubjects([...selectedSubjects, subject]);
      }
    }
    // If subject is already selected, remove it from the list
    else {
      setSelectedSubjects(selectedSubjects.filter((selected) => selected !== subject));
    }
  };

  //fetch topic combinations
  const topicCombinations = []
  selectedSubjects.forEach(async (subject) => {
    try{
      // ../examPatterns/jambSets/jambSet1
      const subjectDataModule = await import(`../examPatterns/jambSets/${subject.toLowerCase()}-set1`);
      topicCombinations.push(...subjectDataModule.default); 
    }catch(error){
      console.log(error);
    }

  })
  //define the questions' object

  // Function to start the exam
  const formData = {
    examBody: 'joint admissions and matriculation exam',
    topicCombinations
  }
  let questions = {};
  
  selectedSubjects.forEach(subject => {
    questions[subject.toLowerCase()] = [];
  });
  const shuffleArray = (array) => {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// Fisher-Yates shuffle algorithm

const startExam = async() => {
  // Add logic to start the exam or navigate to the exam page
  try{
    setError(null)
    setSuccess('getting questions... this may take a minute')
    // const response = await instance.post('/question/getQuestion', formData, config)
    const response = await axios.post(`${configData.dev? 'http://localhost:8000': configData.ALPHALEARN3_BASEURL}/api/v1/questions/McqQuestion/${configData.API_USERNAME}`, formData, config);
    const { data } = response

    if(response.status === 200){

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
              if(el.course.toLowerCase() === 'english' && questions['english'].length < 60){
                questions['english'].push(el)
              }else if(questions[el.course.toLowerCase()].length < 40){
              questions[el.course.toLowerCase()].push(el)
            }
            }
          });

          // Shuffle questions within each subject
        localStorage.setItem('questions', JSON.stringify(questions))
        localStorage.removeItem('viewExplanation')
        setError(null)
        setSuccess('you will be redirected to the exam page')
        setTimeout(() => {
          const duration = 2 * 60 * 60
          localStorage.setItem('duration', duration)
          navigate('/questionDisplay')
        },2000)

      }
    }catch(error){
      setSuccess(null)
      console.log(error);
      if(error?.response?.status === 400){
        setSuccess(null)
        setError('an errror occured while fetching questions')
        }else if(error?.response?.status === 401){
          setSuccess(null)
          setError('you are not authorized to take this exam, try a diffrent exam or relogin')
        }else if(error?.response?.status === 429){
          setError(`slow down a bit!, press start exam in a few seconds`)
        }else if(error?.response?.status === 500){
          setError('Network Error')
        }
        setTimeout(() => setError(null), 5000)
    }
  };
  return (
    <>
    <Helmet>
        <title>JAMB UTME Exam</title>
        <meta name="description" content="Prepare for success in the JAMB CBT exam with our comprehensive practice questions. Tailor your revision with customizable sets, topic-specific quizzes, and in-depth explanations. Excel in every subject and boost your confidence with our JAMB CBT preparation platform. Start your journey to exam success today!" />
      </Helmet>
    <div style={wrapperStyle}>
      <div style={headerWrapper}>
      <img src={jamb} alt='jamb logo' style={jambLogo} />
      <h2 style={headerStyle}>JAMB UTME Exam</h2>
    </div>
      <p style={paragraphStyle}>
        Welcome to the Joint Admissions and Matriculations Board (JAMB) Unified Tertiary Matriculation Examination (UTME) Computer Based Test. This standardized exam is an essential step for Nigerian students seeking admission into higher education institutions. It assesses your knowledge and skills in various subjects, including English, Mathematics, and more.
      </p>
      <p style={paragraphStyle}>
        Please take note of the subject combination required for your chosen course. These are the specific subjects you will be required to write during the exam. if your desired course isn't listed below <a href='http://eligibility.jamb.gov.ng/checker/'>click here</a> to check
      </p>
      <ul style={paragraphStyle}>
        {subjectCombinations.map((combination, index) => (
          <li key={index}>{combination}</li>
        ))}
      </ul>
      <p style={paragraphStyle}>
        Here's what you need to know before starting the exam:
      </p>
      <ul style={paragraphStyle}>
        <li>Ensure you have a stable internet connection.</li>
        <li>Find a quiet and well-lit place to take the exam.</li>
        <li>Have your JAMB registration details ready.</li>
        <li>Read and understand the exam instructions carefully.</li>
        <li>Observe the exam time limit for each section.</li>
        <li>Do not use unauthorized materials or assistance.</li>
      </ul>
        {errorData? <div style={error}>{errorData}</div> : ''}
        {successData ? <div style={success}>{successData}</div> : ''}
        <p style={paragraphStyle}>Please select your subject combination by checking the checkboxes below. You can choose a maximum of four subjects, including English.</p>
      <form style={{display: 'flex', flexDirection: 'column', margin: '0px 10px 10px'}}>
        {availableSubjects.map((subject) => (
          <label key={subject}>
            <input
              type="checkbox"
              checked={selectedSubjects.includes(subject)}
              onChange={() => subject==='English'? '' : handleSubjectSelection(subject)}
            />
            {`  ${subject}`}
          </label>
        ))}
      </form>
      <p style={paragraphStyle}>
        To begin the exam, click the "Start Exam" button below. Good luck!
      </p>
      <button style={buttonStyle} onClick={startExam}>Start Exam</button>
    </div>
    </>
  );
};

export default JambUTMEExam;
