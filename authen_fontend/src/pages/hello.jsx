import {useEffect, useState } from 'react';




function App() {
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      // Fetch data from the Flask API endpoint
      fetch('http://127.0.0.1:5000/recipe/hello')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setMessage(data.message);
        })
        .catch(error => {
          console.error('There was a problem fetching data:', error);
        });
    }, []); // Empty dependency array to run the effect only once on component mount
  
  
    return (
      <div className='app'>
          <h1>{message}</h1>
      </div>
    );
  }
  
  export default App