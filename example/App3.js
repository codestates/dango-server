import React, { useEffect, useState } from 'react';
import { socket3 } from './socket';

const App3 = React.memo(() => {
  const [type, setType] = useState('');
  const handleChange = (e) => {
    setType(e.target.value);
  };
  function sendMsg() {
    socket3.emit('messageToOther', 'user2-Oid', type);
  }

  useEffect(() => {
    socket3.emit('joinroom', ['logout-user1', 'logout-user2', 'logout-user3', 'user2-Oid']);
    socket3.on('hasjoined', (data) => {
      console.log(data);
    });
    socket3.on('messageFromOther', (data) => {
      console.log(data);
    });
  }, []);
  return (
    <div className="App">
      유저3
      <input onChange={handleChange} />
      <button onClick={sendMsg}>유저2에게 메세지 보내기</button>
    </div>
  );
});

export default App3;
