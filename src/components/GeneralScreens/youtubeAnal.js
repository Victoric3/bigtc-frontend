import React, { useState } from 'react';
import '../../Css/youtube.css'
import configData from '../../config.json'

function VideoTable() {
  const [videosData, setVideosData] = useState(null);
  const [channelId, setChannelId] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleChange = (event) => {
    setChannelId(event.target.value);
  };
    const fetchData = async (e) => {
      e.preventDefault();
      setIsLoading(true)
      try {
        const response = await fetch(`${configData.baseUrl}/youtube`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channelId })
        })

        const data = await response.json()
        console.log(data);
        if(response.ok){
          setVideosData(data);
          setIsLoading(false)
        }
      } catch (error) {
        setError('Error fetching data:', error);
        setTimeout(() => {
          setError(null)
        }, 5000);
        setIsLoading(false)
      }
    };
// Function to format numbers with commas
function formatNumber(number) {
  return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to calculate engagement rate
function calculateEngagementRate(views, likes, comments) {
  const totalInteractions = parseInt(likes) + parseInt(comments);
  return ((totalInteractions / parseInt(views)) * 100).toFixed(2);
}


  return (
    <div className='youtube-analytics'>
      <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
        <h1 style={{fontSize: '16px'}}>
          Enter Channel ID:
        </h1>
        <input type="text" value={channelId} onChange={handleChange} />
      <button onClick={fetchData} style={{
        padding: '5px', 
        borderRadius: '5px', 
        color: '#fff', 
        background: 'blue', 
        alignSelf: 'end'
        }}>Get Analytics</button>

      </div>
      <h1>YouTube Channel Analytics</h1>
      {isLoading? <p>loading...</p>: ''}
      {error? <p>{error}</p>: ''}
      {videosData && (
        <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>N/A</th>
              <th>Title</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Engagement</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {videosData.videos.map((video, index) => (
              <tr key={video.title}>
                <td>{index + 1}</td>
                <td>{formatNumber(video.title)}</td>
                <td>{formatNumber(video.views)}</td>
                <td>{formatNumber(video.likes)}</td>
                <td>{formatNumber(video.comments)}</td>
                <td>{calculateEngagementRate(video.views, video.likes, video.comments)}%</td>
                <td>
                  <img src={video.thumbnail} alt={video.title} style={{ width: '130px', height: 'auto' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
    </div>
  );
}

export default VideoTable;
