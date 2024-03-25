import React, { useEffect, useState, useRef, useContext } from 'react';
import instance from '../../Context/axiosConfig';
import Loader from '../GeneralScreens/Loader';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai'
import '../../Css/EditStory.css'
import RichTextEditor from './editor2';


const EditStory = () => {
    const { config } = useContext(AuthContext)
    const slug = useParams().slug
    const imageEl = useRef(null)
    const [loading, setLoading] = useState(true)
    const [isUpLoading, setIsUpLoading] = useState(false)
    // const [story, setStory] = useState({})
    const [image, setImage] = useState('')
    const [previousImage, setPreviousImage] = useState('')
    const [title, setTitle] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()


    useEffect(() => {

        const getStoryInfo = async () => {
            setLoading(true)
            try {
                const { data } = await instance.get(`/story/editStory/${slug}`, config)
                // setStory(data.data)
                setTitle(data.data.title)
                localStorage.setItem('EditedContent', data.data.content)
                setImage(data.data.image)
                setPreviousImage(data.data.image)
                setLoading(false)
            }
            catch (error) {
                navigate("/")
            }
        }
        getStoryInfo()
    }, [slug, navigate, config])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpLoading(true)
        const content = localStorage.getItem('EditedContent')
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("content", content)
        formdata.append("image", image)
        formdata.append("previousImage", previousImage)

        try {
            const { data } = await instance.put(`/story/${slug}/edit`, formdata, config)
            
            setSuccess('Edit Story successfully ')
            setIsUpLoading(false)
            localStorage.removeItem('EditedContent')
            setTimeout(() => {
                navigate('/')
            }, 2500)
            if(data.status === 'fail'){
                setError(data.errorMessage)
                setIsUpLoading(false)
            }

        }
        catch (error) {
            setIsUpLoading(false)
            setTimeout(() => {
                setError('')
            }, 4500)
            setError(error?.response?.data?.error || 'something went wrong')
        }
    }

    return (
        <>
            {
                loading ? <Loader /> : (
                    <div className="Inclusive-editStory-page ">
                        <form onSubmit={handleSubmit} className="editStory-form">

                            {error && <div className="error_msg">{error}</div>}
                            {success && <div className="success_msg">
                                <span>
                                    {success}
                                </span>
                                <Link to="/">Go home</Link>
                            </div>}

                            <input
                                type="text"
                                required
                                id="title"
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                            <RichTextEditor />

                            <div class="currentlyImage">
                                <div class="absolute">
                                    Currently Image
                                </div>
                                <img src={previousImage} alt="storyImage" />
                            </div>
                            <div class="StoryImageField">
                                <AiOutlineUpload />
                                <div class="txt">

                                    {image === previousImage ? "    Change the image in your story " :
                                        image.name}

                                </div>
                                <input
                                    name="image"
                                    type="file"
                                    ref={imageEl}
                                    onChange={(e) => {
                                        setImage(e.target.files[0])
                                    }}
                                />
                            </div>

                            <button type='submit' className='editStory-btn'
                            >Edit Story </button>
                             {isUpLoading? <Loader /> : ''}
                        </form>

                    </div>
                )
            }
        </>
    )
}

export default EditStory;
