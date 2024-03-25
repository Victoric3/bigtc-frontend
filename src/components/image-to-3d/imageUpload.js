import React, { useState } from 'react';
import '../../Css/imageUpload.css';
import logo from '../../img/logo.png'
const ImageUpload = () => {
  const [images, setImages] = useState([]);

  const handleFileInputChange = (event) => {
    const selectedImages = event.target.files;
    setImages([...images, ...selectedImages]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedImages = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    setImages([...images, ...droppedImages]);
  };

  return (
    <div className='image-component-wrapper'>
      <div className='logo-header-wrapper'>
        <img src={logo} alt='kingsheart-logo' className='logo'/>
        <h2 className='logo-txt'>kingsheart</h2>
        <h1 className='image-heading'>
          Convert images to 3d objects
          </h1>
      </div>
        <div className='selected-image-wrapper'>
      <label htmlFor="fileInput" className='image-file-input-label'>Select Images
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className='image-file-input'
        />
      </label>
        </div>
        <p>or</p>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '5px',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <p>Drag and drop images here</p>
      </div>

      {images.length > 0 && (
        <div className='selected-image-list'>
          <p>Selected Images:</p>
          <ul>
            {images.map((image, index) => (
              <li key={index}>{image.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
