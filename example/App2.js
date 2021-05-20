import React, { useEffect, useState } from 'react';
import { socket2 } from './socket';
const App2 = React.memo(() => {
  const [type, setType] = useState('');
  const [type2, setType2] = useState('');

  const handleChange1 = (e) => {
    setType(e.target.value);
  };
  const handleChange2 = (e) => {
    setType2(e.target.value);
  };
  function sendMsg1() {
    socket2.emit('messageToOther', 'user1-Oid', type);
  }
  function sendMsg3() {
    socket2.emit('messageToOther', 'user3-Oid', type2);
  }
  useEffect(() => {
    socket2.emit('joinroom', ['logout-user1', 'logout-user2', 'logout-user3', 'user1-Oid', 'user3-Oid']);
    socket2.on('hasjoined', (data) => {
      console.log(data);
    });
    socket2.on('messageFromOther', (data) => {
      console.log(data);
    });
  }, []);
  return (
    <div className="App">
      유저2
      <input onChange={handleChange1} />
      <button onClick={sendMsg1}>유저1에게 메세지 보내기</button>
      <div> </div>
      유저2
      <input onChange={handleChange2} />
      <button onClick={sendMsg3}>유저3에게 메세지 보내기</button>
    </div>
  );
});

export default App2;
