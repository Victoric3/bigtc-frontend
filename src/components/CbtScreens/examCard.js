import React from 'react';
import '../../Css/Home.css'
const ExamCard = ({ imageSrc, title, description, buttonText, onClick, color, background }) => {
  
  return (
    <div className="story-card">
      <img src={imageSrc} alt={title} className='story-image' onClick={onClick}/>
      <h1 className='story-title' style={{padding: '5px', fontSize: '30px'}}>{title}</h1>
      <p className='exam-text' style={{padding: '5px'}}>{description.split(' ').splice(0, 20).join(' ')}...</p>
      <button style={{
            background: background, 
            color: color, 
            borderRadius: '5px', 
            alignSelf: 'end',
            position: 'absolute',
            bottom: '5px',
            right: '5px'
        }} onClick={onClick}>{buttonText}</button>
    </div>
  );
};

export default ExamCard;
