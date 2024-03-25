import React, {useContext} from "react";
import {AuthContext} from "../../Context/AuthContext";
import logo from '../../img/logo.png';
import { useNavigate } from "react-router-dom";



const ResultCard = (props) => {
  // Destructure the props object
  const navigate = useNavigate()
  const { activeUser } = useContext(AuthContext)
//   const { name, photo, exam, score, feedback } = props;
  const name = activeUser.username?.trim()
  const exam = localStorage.getItem('examBody')
  const subjectScores = JSON.parse(localStorage.getItem('subjectScores'))
  const totalQuestions = localStorage.getItem('totalQuestions')
  const totalScore = localStorage.getItem('totalScores')
 

  return (
    <>
    <div style ={styles.container}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
      />
      <div style={styles.header}>
        <h1>Exam Result</h1>
      </div>


      <div style={styles.studentInfo}>
        <h4>Student Information</h4>
        <p><strong>username:</strong>{` ${name}`}</p>
        <p><strong>Exam Taken:</strong>{` ${exam.toUpperCase()}`}</p>
      </div>

      <div style={styles.subjectInfo}>
        <h4>Performance</h4>
        {Object.entries(subjectScores).map(([subject, score]) => (
          <p key={subject}>
            <strong>{subject.charAt(0).toUpperCase() + subject.slice(1)}</strong>: {score}
          </p>
        ))}
      </div>

      <div style={styles.resultInfo}>
        <h4>Overall Performance</h4>
        {exam.toUpperCase() === 'UTME' ? <p><strong>Jamb Score:</strong>{` ${Math.floor(totalScore/totalQuestions * 400)}`}</p> : 
          <p><strong>Total Score:</strong>{` ${Math.floor(totalScore/totalQuestions * 100)}%`}</p>
        }
        <p><strong>Total Questions:</strong>{` ${totalQuestions}`}</p>
        <p style={{
          color: totalScore < 0.4 * totalQuestions ? 'red' : (totalScore < 0.6 * totalQuestions) > 0.4 * totalQuestions ? '#333' : 'green'
        }}><strong>Questions Correct:</strong>{` ${totalScore}`}</p>
        <p style={{
          color: totalQuestions - totalScore > 0.5 * totalQuestions? 'red' : ''
        }}><strong>Questions Incorrect:</strong>{` ${totalQuestions - totalScore}`}</p>
      </div>
        <div style={{
          width: '100%',
          justifyContent: 'space-between',
          display: 'flex',
          gap: '5px'
        }}>

      <button style={{
        background: '#333',
        padding: '5px',
        borderRadius: '5px',
        color: '#fff'
      }}
        onClick={() => {
            localStorage.setItem('viewExplanation', true)
            navigate('/questionDisplay')
      }}
        >View Explanation</button>

      <button style={{
        background: 'green',
        padding: '5px',
        borderRadius: '5px',
        color: '#fff'
      }}
      onClick={() => {
        localStorage.removeItem('viewExplanation')
        navigate('/jamb')
      }}
      >New Exam</button>
    </div>
    </div>
</>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '50px auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
    header: {
    color: '#ccc',
    padding: '10px',
    borderRadius: '5px',
  },
  logo: {
    maxWidth: '100px',
    margin: '0 auto',
    borderRadius: '50%',
    height: 'auto'
  },
  studentInfo: {
    marginTop: '20px',
    textAlign: 'left',
    fontWeight: '400'
  },
  subjectInfo: {
    marginTop: '30px',
    textAlign: 'left',
    fontWeight: '400'
  },
  resultInfo: {
    marginTop: '30px',
    textAlign: 'left',
    fontWeight: '400'
  }
};



export default ResultCard;
