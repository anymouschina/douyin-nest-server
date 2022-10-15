import socketio

sio = socketio.Client()
class Client():
    def init(host):
        sio.connect(host)
    def send_message(type,data):
        sio.emit(type,data)
    @sio.event
    def connect():
        print('connection established')
    @sio.on('hehe')
    def on_message(data):
        print('client received a message!',data)
    # @sio.event
    # def message(data):
    #     print('message received with ', data)
    #     sio.emit('client', {'response': 'my response'})

    @sio.event
    def connect_error():
        print("The connection failed!")
        sio.disconnect()

    @sio.event
    def disconnect():
        print('disconnected from server')
        sio.disconnect()
