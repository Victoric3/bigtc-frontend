import {useState} from "react";
import '../../Css/Header.css';
import navLinks from '../utilities/navLinks';
import { BiPhoneOutgoing } from 'react-icons/bi';
import downArrow from '../../img/downarrow.png'
import { useNavigate } from "react-router-dom";


const Drawer = () => {
    const navigate = useNavigate()
    const [showChildren, setShowChildren] = useState(false)
    const [activeIndex, setActiveIndex] = useState('')
    const handleClick = (index) => {
        setActiveIndex(index)
        setShowChildren(!showChildren)
    }
    return ( <>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            gap: '15px',
            background: '#000',
            marginTop: '15px'
        }}>
                {
                    navLinks.map((navLink, index) => {
                    return <div 
                        key={index} 
                        className= 'nav_link' 
                        onClick={() => {navLink.children ? handleClick(index) : navigate(`${navLink.navLink}`)}} 
                        >
                            <h2 style={{color: '#fff', fontSize: '22px'}}>
                                
                                {index === navLinks.length - 1 && <BiPhoneOutgoing />}{` ${navLink.navName}`}{navLink.children && <img src={downArrow} alt='downArrow' style={{
                                    width: '20px',
                                    height: 'auto'
                                }}/>}
                            </h2>

                            {showChildren && activeIndex === index? <div className="accordion_content" style={{left: 0, transform: 'none', width: '100%'}}>
                                {navLink?.children?.map((childNavLink, childIndex) => (
                                    <div key={childIndex} className='nav_link' onClick={() => navigate(`${childNavLink.navLink}`)}>
                                        <img src={childNavLink.img} alt={`${childNavLink.navName}`} />
                                        <h2 style={{color: '#333'}}>
                                            {childNavLink.navName}
                                        </h2>
                                    </div>
                                ))}
                            </div> : ''}
                        </div>
                    })
                }
                </div>
    
    
    </> );
}
 
export default Drawer;