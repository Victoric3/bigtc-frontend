import React from "react";
import { Helmet } from "react-helmet";
import instance from "../../Context/axiosConfig";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css";
import { useNavigate } from "react-router-dom";
import configData from "../../config.json";
import Banner from "../utilities/banner";
import ServicesComponent from "../utilities/services";
import LandingPageSection from "../utilities/imageTextPair";
import SquareCard from "../utilities/squareCard";
import {
  BiDollarCircle,
  BiTime,
  BiCheckCircle,
  BiSupport,
} from "react-icons/bi";
import responsiveFlexStyleSquare from "../../Css/flexContainer.css";
import StaticBanner from "../utilities/staticBanner";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get("search");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      try {
        const { data } = await instance.get(
          `/story/getAllStories?search=${searchKey || ""}&page=${page}`
        );

        if (searchKey) {
          navigate({
            pathname: "/",
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        }

        setStories(data.data);
        localStorage.setItem("stories", JSON.stringify(data.data));
        setPages(data.pages);

        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    getStories();
  }, [setLoading, search, page, navigate, searchKey]);

  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Inclusive-home-page">
      <Helmet>
        <title>{`Home | ${configData.Name}`}</title>
        <meta
          name="description"
          content="KingsHeart offers fun and easy exam preparation. Learn from animated videos, practice questions, and more. Join today!"
        />
      </Helmet>
      <Banner />
      <ServicesComponent />
      <LandingPageSection
        caption="Creating a product is hard enough let us help you market it"
        description="Launching a product is no small feat. 
      From inception to market, the journey is riddled with challenges. 
      That's where we step in. 
      Our suite of services spans from unleashing creativity to driving marketing strategies. 
      Whether it's captivating animations, strategic marketing campaigns, 
      or seamless SEO integration, we've got you covered. 
      Let us be your partner in success, 
      helping you land sales, and convert prospects into loyal customers. 
      With us by your side, your product's journey to success just got a whole lot smoother.
      "
        buttonText="Learn More"
        imageUrl="https://i.ibb.co/xSD3g2G/social-media-5187243-1920-removebg-preview.png"
      />
      <LandingPageSection
        caption="Our Services Offer Premium Quality at Affordable Prices."
        description={`At ${configData.Name}, we believe that quality shouldn't come at a premium. That's why we've curated our suite of services to provide exceptional value at Affordable rates. From captivating animations to strategic marketing campaigns and seamless SEO integration, our services are designed to deliver results without breaking the bank. With us, you can trust that you're investing wisely, receiving top-notch quality services at prices that reflect their true value. Experience the difference with ${configData.Name} today`}
        buttonText="Discover More"
        imageUrl="https://i.ibb.co/qBcNFgk/money-6626359-1920-removebg-preview.png"
        inverted
      />
      <h2
        variant="h4"
        style={{
          marginTop: "100px",
          marginBottom: "50px",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Why Choose Us?
      </h2>
      <div
        className="responsive-flex-square-container"
        style={responsiveFlexStyleSquare}
      >
        <SquareCard
          icon={<BiDollarCircle fontSize="38px" />}
          title="Affordable Pricing"
          content="Competitively priced services without compromising quality. Exceptional value for your investment."
        />

        <SquareCard
          icon={<BiTime fontSize="38px" />}
          title="Fast Delivery"
          content="Timely delivery guaranteed. Streamlined processes ensure quick turnaround times."
        />

        <SquareCard
          icon={<BiCheckCircle fontSize="38px" />}
          title="Uncompromising Quality"
          content="Top priority on quality. Strict standards and rigorous checks for excellence."
        />

        <SquareCard
          icon={<BiSupport fontSize="38px" />}
          title="Exceptional Customer Support"
          content="Round-the-clock support. Dedicated team to address all queries and concerns."
        />
      </div>
      <StaticBanner />

      <div className="blog-caption">
        <h4>{"Latest Posts>>>"}</h4>
      </div>

      {loading ? (
        <div className="skeleton_emp">
          {[...Array(3)].map(() => {
            return (
              // theme dark :> default : light
              <SkeletonStory key={uuidv4()} />
            );
          })}
        </div>
      ) : (
        <div>
          <div className="story-card-wrapper">
            {stories.length !== 0 ? (
              stories.map((story) => {
                return <>
                <CardStory key={uuidv4()} story={story} />
                </>
              })
            ) : (
              <NoStories />
            )}
          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
