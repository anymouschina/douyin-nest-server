import traceback
import json
import base64
from datetime import datetime
from messages.socket_client import Client
from config.helper import config
Client.init('http://localhost:3001')
class MessageBody:
    def __init__(self) -> None:
        pass
class Base:

    instance = None

    def set_payload(self, payload):
        self.instance.ParseFromString(payload)

    def extra_info(self):
        return dict()

    @property
    def room_id(self):
        if hasattr(self.instance, 'common'):
            return self.instance.common.roomId
        return None

    def user(self):
        if(hasattr(self.instance, 'user')):
            return self.instance.user

        return None

    def __str__(self):
        pass
    def send_message(self, message):
        Client.send_message('danmu',json.dumps({
            'user':  str(self.user()),
            'content':message,
            'live-room':config()['live']['rooms']
        }))
