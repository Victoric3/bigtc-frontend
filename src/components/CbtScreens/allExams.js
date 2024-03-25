import React, {useMemo, useState, useEffect, useContext, useCallback} from "react";
import SearchForm from "../GeneralScreens/searchFormSearch";
import { useNavigate } from "react-router-dom";
import '../../Css/allExams.css'
import instance from "../../Context/axiosConfig";
import { AuthContext } from '../../Context/AuthContext';
import Loader from "../GeneralScreens/Loader";
import Pagination from "../GeneralScreens/Pagination";
import jamb from '../../img/jambImg.jpg';
import { Helmet } from 'react-helmet';
import configData from '../../config.json'


const AllExams = () => {
    const navigate = useNavigate()
    const { config } = useContext(AuthContext);
    const [suggestions, setSuggestions] = useState([])
    const navigateEvent = useMemo(() => new Event('navigateEvent'), []);
    const [exams, setExams] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [pages, setPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('');


    
    const handlefetchExam = useCallback(async (pageNumber) => {
        try{
          
            setLoading(true)
            const response = await instance.get(`/exam/getExam?page=${pageNumber}${searchTerm ? `&search=${searchTerm}` : ''}`, config)

            const exams = response?.data?.allExams
            const joinedArray = [{
              name: 'Utme Simulator',
              grade: 'SS3',
              difficulty: 'Medium',
              questionLength: 180,
              category: 'all',
              date: '01/11/2023',
              _id: 12345,
              image: jamb
            }, ...exams]

            setExams(joinedArray)

            setPages(response?.data?.maxPages)

        }catch(error){
            if(error?.response?.status === 404){
            console.log(error?.response?.data?.errorMessage);
        }else{
            console.log(error);
        }
        } finally{
            setLoading(false)
        }
    }, [config, searchTerm])


    
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
        setSearchTerm(urlParams.get('search') || searchTerm);
        handlefetchExam(page)

      }, [searchTerm, page, handlefetchExam])



  useEffect(() => {
    const handleStorageChange = () => {
      // Update state or take other actions when local storage changes
      const suggestionArray = JSON?.parse(localStorage.getItem('examSuggestions'));
      setSuggestions(suggestionArray);
    };
  
    // Listen for the custom event
    window.addEventListener('storageChange', handleStorageChange);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);


    const handleNavigation = (local) => {
      localStorage.removeItem('examSuggestions')
      if(local === 12345){
        navigate(`/jamb`)
      }else{
        navigate(`/allExams/details/${local}`)
        setSuggestions([])
        window.dispatchEvent(navigateEvent);
      }
      }

    
    return ( 
    <>
    <Helmet>
        <title>{`Exam Hub | ${configData.Name}`}</title>
        <meta name="description" content={
          `
          Exam Hub comprises a list of exams prepared to simulate a specific question pattern or exam. 
          Here, questions are already structured based on a topic or standard exam. 
          Answering questions organized by professionals is a good way to intensify your understanding of a topic or grasp the patterns of exams.`} />
      </Helmet>
    <div className="all-exams-wrapper">
        <div className="search-wrapper">
            <SearchForm exam={true} setSearch={setSearchTerm}/>
            {suggestions?.length > 0? <ul className="suggestion-display" style={{
              top: '172px'
            }}>
                {suggestions?.map((suggestion, index) => (
                <li key={index} onClick={() => handleNavigation(suggestion?.id)}>{suggestion?.title}</li>
                ))}
                </ul> : ''}
        </div>
        <div className="all-exam-cards-wrapper">
        {loading 
        ? 
        <Loader /> 
        : 
        
        exams.map((exam) => 
        <div className="exam-card-wrapper" key={exam?._id} onClick={() => handleNavigation(exam?._id)}>
        <div style={{width: '30%'}}>
        <img src={exam.image} alt="Exam" className="exam-card-image" />
        </div>
        <div>
        <h1 style={{fontSize: '20px'}} className="exam-card-details">{exam?.name?.length > 30?`${exam?.name.trim()?.slice(0, 30)}..` : exam?.name}</h1>
        <p className="exam-card-details">Questions: <strong >{exam?.questionLength}</strong></p>
        <p className="exam-card-details">Category:<strong >{exam?.category}</strong></p>
        <p className="exam-card-date">date: {new Date(exam?.date).toLocaleDateString()}</p>
        </div>
        </div>)

       

}
        <Pagination page={page} pages={pages} changePage={setPage} /> 
        </div>
      </div>
      </>
   );
}
 
export default AllExams;