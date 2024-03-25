import React from 'react'
import { useState, useContext, useRef } from 'react'
import instance from '../../Context/axiosConfig'
import { Link } from 'react-router-dom'
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AiOutlineUpload } from 'react-icons/ai';
import { FiArrowLeft } from 'react-icons/fi';
import '../../Css/AddStory.css';
import RichTextEditor from './Editor';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Loader from "../GeneralScreens/Loader";
import slugify from 'slugify';




const AddStory = () => {
    const { config } = useContext(AuthContext)
    let question
    try{
        question = JSON.parse(localStorage.getItem('question'))
    }catch(error){
        console.error(error);
    }

    const [title, setTitle] = useState(question?.question)
    const [image, setImage] = useState('')
    const [hover, setHover] = useState(false)
    const navigate = useNavigate();
    const viewExplanation = localStorage.getItem('viewExplanation')
    const imageEl = useRef(null)
    const editorEl = useRef(null)
    const exam =   localStorage.getItem('examBody')
    const [isLoading, setIsLoading] = useState(false)

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [action, setAction] = useState(false)


    const clearInputs = () => {
        setTitle('')
        setImage('')
        editorEl.current.editor.setData('')
        imageEl.current.value = ""
    }


    const content = localStorage.getItem('content')


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("image", image)
        formdata.append("content", content)
        // const form = { title, content, exam }
        question ? formdata.append("exam", exam) : formdata.append("exam", false)
        try {
            await instance.post("/story/addstory", formdata, config)
            setSuccess('story Added successfully ')
            localStorage.removeItem('question')
            localStorage.removeItem('content')
            clearInputs()
            setTimeout(() => {
                setSuccess('')
                navigate('/')
            }, 4000)
            setIsLoading(false)
           
        }
        catch (error) {
            setTimeout(() => {
                setError('')
                setAction(false)
            }, 7000)
            if (error?.response?.data?.error.trim() === 'Duplicate Field Value Enter') {
                setAction(true)
                localStorage.removeItem('question')
            } else {
                setError(error?.response?.data?.error || 'Something went wrong');
            }       
            setIsLoading(false) 
        }

    }
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
      }
    return (
        <div className="Inclusive-addStory-page ">
            {action? 
            <div className='story-message-card'>
                <p>This post already exist, <span onClick={() => handleNavigation(title)} style={{cursor: 'pointer', color: 'blue'}}>click to view</span></p>
            </div> : ''}
            <button onClick={() => {
                setHover(!hover)
            }}>
                <FiArrowLeft />
            </button>
            {hover ?
            <div className='story-nav-card-wrapper'>
                <div className='story-nav-card-element' style= {{
                    borderBottom: '1px solid #fadedf'
                }} onClick={() => {navigate('/')}}>Back To Home</div>
                <div className='story-nav-card-element' onClick={() => {viewExplanation? navigate('/questionDisplay') : navigate('/customExam')}}>Back To Study</div>
            </div>: ''}
            
            
            <form onSubmit={handleSubmit} className="addStory-form">
                {error && <div className="error_msg" style={{
                    right: 0,
                    top: 0,
                    position: 'absolute',
                }}>{error}</div>}
                {success && <div className="success_msg" style={{
                    right: 0,
                    top: 0,
                    position: 'absolute',
                }}>
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
                
                <div class="StoryImageField">
                    <AiOutlineUpload />
                    <div class="txt">
                        {image ? image.name :
                            " Include a high-quality image in your story to make it more inviting to readers."
                        }
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
                <button type='submit' disabled={title || isLoading ? false : true} className={title ? 'addStory-btn' : 'dis-btn'}
                >Publish </button>
                {isLoading? <Loader /> : ''}
            </form>

        </div>

)
}

export default AddStory


