import React, {useEffect, useState, useMemo} from "react";
import SearchForm from "./searchFormSearch";
import { useLocation } from "react-router-dom";
import instance from "../../Context/axiosConfig";
import { useNavigate } from "react-router-dom";
import NoStories from "../StoryScreens/NoStories";
import { v4 as uuidv4 } from 'uuid';
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from '../StoryScreens/CardStory';
import Pagination from "./Pagination";
import '../../Css/Home.css'
import slugify from 'slugify';


const Search = () => {
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
            pathname: '/search',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        }
        else {
          navigate({
            pathname: '/search',
            search: `${page > 1 ? `page=${page}` : ""}`,
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

  const [suggestions, setSuggestions] = useState([])
  const navigateEvent = useMemo(() => new Event('navigateEvent'), []);


  useEffect(() => {
    const handleStorageChange = () => {
      // Update state or take other actions when local storage changes
      const suggestionArray = JSON?.parse(localStorage.getItem('suggestions'));
      setSuggestions(suggestionArray);
    };
  
    // Listen for the custom event
    window.addEventListener('storageChange', handleStorageChange);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);

  const makeSlug = (title) => {
    return slugify(title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })
}
const handleNavigation = (local) => {
    const titleSlug = makeSlug(local)
    navigate(`/story/${titleSlug}`)
    setSuggestions([])
    window.dispatchEvent(navigateEvent);
  }
  

  return ( 
    <>
       <div className="search-wrapper">
            <SearchForm exam={false}/>
            {suggestions.length > 0? <ul className="suggestion-display">
                {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleNavigation(suggestion?.title)}>{suggestion?.title}</li>
                ))}
                </ul> : ''}
        </div>

            {loading ?

        <div className="skeleton_emp">
        {
            [...Array(6)].map(() => {
            return (
                <SkeletonStory key={uuidv4()} />
                    )
                    })}
        </div>

        :
        <div>
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
    
    </> );
}
 
export default Search;