import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const QuranList = () => {
  const [surahList, setSurahList] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  // const [visitedSurahs, setVisitedSurahs] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetch('https://al-quran-8d642.firebaseio.com/data.json?print=pretty')
      .then(response => response.json())
      .then(data => {
        setSurahList(Object.values(data));
      })
      .catch(error => {
        console.error('Error:', error);
      });

      // Fetch history data
    fetch('http://localhost:5000/api/get_history')
    .then(response => response.json())
    .then(data => {
      setHistoryData(data);
      console.log('History')
      console.log(data);

    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
    // setVisitedSurahs([...visitedSurahs, surah.nama]);
    setHistoryData([...historyData, { data: surah.nama }]);

    const postData = {
      data: surah.nama // Example: You can adjust this according to your data structure
    };
  
    // Send POST request to the history API
    fetch('http://localhost:5000/api/post_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  };

  const closeModal = () => {
    setSelectedSurah(null);
  };

  return (
    <div className="container">
      <h1 className="text-center">List Surah</h1>
      <div className="row">
        {surahList.map((surah, index) => (
          <div className="col-md-6" key={index}>
            <button className="btn btn-primary" onClick={() => handleSurahClick(surah)}>
              {surah.nama}
            </button>
          </div>
        ))}
      </div>

      {selectedSurah && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedSurah.nama}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedSurah.arti}</p>
                <p>{selectedSurah.keterangan}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <h2>Visited Surahs</h2>
      <ul>
        {visitedSurahs.map((surah, index) => (
          <li key={index}>{surah}</li>
        ))}
      </ul> */}

      <h2>Visited Surahs</h2>
      <ul>
        {historyData.map((record, index) => (
          <li key={index}>{record.data}</li>
        ))}
      </ul>
    </div>
  );
}

export default QuranList;