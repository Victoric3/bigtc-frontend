import React from 'react';
import { Helmet } from 'react-helmet';
import instance from "../../Context/axiosConfig";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css"
import examHub from '../../img/examHub.jpeg'
import topic from '../../img/topic.jpg'
import study from '../../img/custom.jpg'
import { useNavigate } from "react-router-dom"
import ExamCard from "../CbtScreens/examCard";
import configData from '../../config.json'

const Home = () => {
  const search = useLocation().search
  const searchKey = new URLSearchParams(search).get('search')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);


  useEffect(() => {
    const getStories = async () => {

      setLoading(true)
      try {

        const { data } = await instance.get(`/story/getAllStories?search=${searchKey || ""}&page=${page}`)

        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        }
        
        setStories(data.data)
        localStorage.setItem('stories', JSON.stringify(data.data))
        setPages(data.pages)

        setLoading(false)
      }
      catch (error) {
        setLoading(true)
      }
    }
    getStories()
  }, [setLoading, search, page, navigate, searchKey])


  useEffect(() => {
    setPage(1)
  }, [searchKey])

  
  const handleNavigate = (local) => {
      navigate(`/${local}`)
  }
  
  useEffect(() => {
    window.scrollTo(0, 0)
  },[])
  


  return (
    <div className="Inclusive-home-page">
      <Helmet>
        <title>{`Home | ${configData.Name}`}</title>
        <meta name="description" content="KingsHeart offers fun and easy exam preparation. Learn from animated videos, practice questions, and more. Join today!" />
      </Helmet>
      <div className="story-card-wrapper" style={{minHeight: '0px'}}>
        <ExamCard 
          imageSrc={examHub}
          title={'Exam Hub'}
          description={`Practice with the “Exam Hub.” This mode offers a variety of exam mockups based on different exam styles and topics, as well as some standard exams. It also provides detailed feedback and explanations to help you improve your skills.`}          
          buttonText={'Take Exam'}
          onClick={() => {
            handleNavigate('allExams') 
          }}
          color={'white'}
          background={'green'}
        />
        <ExamCard 
          imageSrc={topic}
          title={'Topic by Topic'}
          description={'If you want to study in a structured and thorough way, you can select the "Topic-by-Topic" mode. This mode will show you all the questions related to a specific subject, so you can master it in depth. This is a great way to learn efficiently and effectively.'}
          buttonText={'Study Mode'}
          onClick={() => {
            handleNavigate('topicByTopic')
            localStorage.setItem('examBody', 'topic')
          }}
          color={'white'}
          background={'blue'}
          />
        <ExamCard 
          imageSrc={study}
          title={'Custom Exam'}
          description={`Want to create your own exams based on your preferences? Try the "Custom Exam" mode and choose the questions, topics, and difficulty levels that suit you best. It's a great way to test yourself on what you really want to learn.`}
          buttonText={'Custom Mode'}
          onClick={() => {
            handleNavigate('customExam')
            localStorage.setItem('examBody', 'custom')
          }}
          color={'white'}
          background={'red'}
          />
        </div>
      {loading ?

        <div className="skeleton_emp">
          {
            [...Array(6)].map(() => {
              return (
                // theme dark :> default : light
                <SkeletonStory key={uuidv4()} />
              )
            })}
        </div>

        :
        <div>
          <div className="blog-caption"><h4>{'Latest Posts>>>'}</h4></div>
          <div className="story-card-wrapper">
            {stories.length !== 0 ?
              stories.map((story) => {
                return (
                  <CardStory key={uuidv4()} story={story} />
                )
              }) : <NoStories />
            }
            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />

          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />

        </div>

      }
      <br />
    </div>

  )

};

export default Home;