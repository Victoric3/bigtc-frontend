const wrapperStyle = {
    // textAlign: 'center',
    padding: '20px',
    // border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  };
  const headerWrapper = {
    textAlign: 'center',
    margin: '0 auto',
  };
  const jambLogo = {
    width : '100px',
    height: 'auto',
    borderRadius: '50%'
  }

  const headerStyle = {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'end'
  };
  const error = {
      width: '100%',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      marginTop: '-1.2rem',
      backgroundColor: 'rgba(245, 72, 72, 0.9)',
      color: 'white',
      padding: '8px',
      fontSize: '0.9rem',
      textAlign: 'center',
  };
  const success = {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    marginTop: '-1.2rem',
    backgroundColor: 'rgba(0, 128, 0, 0.762)',
    color: 'white',
    padding: '8px',
    fontSize: '0.9rem',
    textAlign: 'center',
  };

module.exports = {buttonStyle, error, success, paragraphStyle,headerWrapper, jambLogo, headerStyle, wrapperStyle}