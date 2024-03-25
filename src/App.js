import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import PrivateRoute from './components/Routing/PrivateRoute';
import Home from "./components/GeneralScreens/Home"
import LoginScreen from "./components/AuthScreens/LoginScreen"
import RegisterScreen from "./components/AuthScreens/RegisterScreen"
import ConfirmEmailAndSignUp from "./components/AuthScreens/confirmEmailAndSignUp"
import ForgotPasswordScreen from "./components/AuthScreens/ForgotPasswordScreen"
import ResetPasswordScreen from "./components/AuthScreens/ResetPasswordScreen"
import AddStory from './components/StoryScreens/AddStory';
import DetailStory from './components/StoryScreens/DetailStory';
import Header from './components/GeneralScreens/Header';
import Footer from './components/GeneralScreens/Footer';
import Profile from './components/ProfileScreens/Profile';
import EditProfile from './components/ProfileScreens/EditProfile';
import ChangePassword from './components/ProfileScreens/ChangePassword';
import NotFound from './components/GeneralScreens/NotFound';
import EditStory from './components/StoryScreens/EditStory';
import ReadListPage from './components/ProfileScreens/ReadListPage';
import PrivacyPolicy from './components/GeneralScreens/privacyPolicy';
import TermsOfService from './components/GeneralScreens/termsOfService';
import JambUTMEExam from './components/CbtScreens/jambInfo';
import QuestionComponent from './components/CbtScreens/questionDisplay';
import ResultCard from './components/CbtScreens/resultTemp';
import TopicByTopicExam from './components/CbtScreens/topicByTopic';
import CustomExam from './components/CbtScreens/customExam';
import ExamHistoryList from './components/CbtScreens/examHistory';
import Search from './components/GeneralScreens/search';
import AllExams from './components/CbtScreens/allExams';
import SitemapViewer from './components/GeneralScreens/sitemap';
import ExamPage from './components/CbtScreens/allExamDetails';
import CookieNotification from './components/GeneralScreens/cookieNotification';
import ImageUpload from './components/image-to-3d/imageUpload';
import VideoTable from './components/GeneralScreens/youtubeAnal';


const App = () => {

      return (
            <Router>
                  <div className="App">

                         <Routes>
                              <Route path="/" element={<LayoutsWithHeader />}>

                                    <Route path='*' element={<NotFound />} />

                                    <Route exact path='/' element={<Home />} />
                                    <Route exact path='/privacy-policy' element={<PrivacyPolicy />} />
                                    <Route exact path='/terms-of-service' element={<TermsOfService />} />
                                    <Route exact path='/jamb' element={<PrivateRoute />}>
                                    <Route exact path='/jamb' element={<JambUTMEExam />} />
                                    </Route>
                                    <Route exact path='/allExams' element={<PrivateRoute />}>
                                    <Route exact path='/allExams' element={<AllExams />} />
                                    </Route>
                                    <Route exact path='/allExams' element={<PrivateRoute />}>
                                    <Route exact path='/allExams/details/:slug' element={<ExamPage />} />
                                    </Route>
                                    <Route exact path='/topicByTopic' element={<PrivateRoute />}>
                                    <Route exact path='/topicByTopic' element={<TopicByTopicExam />} />
                                    </Route>
                                    <Route exact path='/customExam' element={<PrivateRoute />}>
                                    <Route exact path='/customExam' element={<CustomExam />} />
                                    </Route>
                                    <Route exact path='/questionDisplay' element={<PrivateRoute />}>
                                    <Route exact path='/questionDisplay' element={<QuestionComponent />} />
                                    </Route>
                                    <Route exact path='/resultTemp' element={<PrivateRoute />}>
                                          <Route exact path='/resultTemp' element={<ResultCard />} />
                                    </Route>


                                    <Route exact path="/story/:slug" element={<DetailStory />} />

                                    <Route exact path='/addstory' element={<PrivateRoute />}>
                                          <Route exact path='/addstory' element={<AddStory />} />
                                    </Route>

                                    <Route exact path='/profile' element={<PrivateRoute />}>
                                          <Route exact path='/profile' element={<Profile />} />
                                    </Route>
                                    <Route exact path='/examHistory' element={<PrivateRoute />}>
                                          <Route exact path='/examHistory' element={<ExamHistoryList />} />
                                    </Route>

                                    <Route exact path='/edit_profile' element={<PrivateRoute />}>
                                          <Route exact path='/edit_profile' element={<EditProfile />} />
                                    </Route>

                                    <Route exact path='/change_Password' element={<PrivateRoute />}>
                                          <Route exact path='/change_Password' element={<ChangePassword />} />
                                    </Route>

                                    <Route exact path='/story/:slug/like' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/like' element={<DetailStory />} />
                                    </Route>

                                    <Route exact path='/story/:slug/edit' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/edit' element={<EditStory />} />
                                    </Route>

                                    <Route exact path='/story/:slug/delete' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/delete' element={<DetailStory />} />
                                    </Route>
                                    <Route exact path='/story/:slug/addComment' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/addComment' element={<DetailStory />} />
                                    </Route>
                                    
                                    

                                    <Route exact path='/readList' element={<PrivateRoute />}>
                                          <Route exact path='/readList' element={<ReadListPage />} />
                                    </Route> 
                                    <Route exact path='/3dconverter' element={<PrivateRoute />}>
                                          <Route exact path='/3dconverter' element={<ImageUpload />} />
                                    </Route> 
                                    <Route exact path='/youtube' element={<VideoTable />} />
                                    

                              </Route>

                              <Route exact path='/search' element={<Search />} />
                               <Route exact path="/login" element={<LoginScreen />} />
                              <Route exact path="/register" element={<RegisterScreen />} />
                              <Route exact path="/confirmEmailAndSignUp/:token" element={<ConfirmEmailAndSignUp />} />

                              <Route exact path="/forgotpassword" element={<ForgotPasswordScreen />} />

                              <Route exact path="/resetpassword" element={<ResetPasswordScreen />} />
                              <Route exact path="/sitemap.xml" element={<SitemapViewer />} />


                        </Routes> 

                  </div>

            </Router>

      );

}

const LayoutsWithHeader = () => {

      return (
            <>
            <div style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  minHeight: '100vh',
                  justifyContent: 'space-between'}}>
            <div>
                  <Header />
                  <Outlet />
                  <CookieNotification />
            </div>
                  <Footer />
            </div>
            </>
      );
}

export default App;
