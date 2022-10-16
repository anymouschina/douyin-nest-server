const sc = document.createElement('script');
sc.src= "https://cdn.bootcss.com/socket.io/2.1.1/socket.io.dev.js"
sc.onload = ()=>{
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
}
document.body.appendChild(sc);