const { io } = require('socket.io-client');

const socket = io('http://0.0.0.0:3001?url=https://live.douyin.com/5893162289');

socket.on('connect', () => {
  console.log('已连接服务端');
  socket.emit('createDouyin','11')
});

// socket.emit('danmu', 'hello');

socket.on('message',(msg)=>{
    console.log('收到消息： ',msg)
})
socket.on('reply',(msg)=>{
    console.log('收到消息：replay ',msg)
})