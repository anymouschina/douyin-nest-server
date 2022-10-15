import time
from protobuf import message_pb2
from messages.base import Base

class ChatMessage(Base):
    def __init__(self):
        self.instance = message_pb2.ChatMessage()

    @property
    def content(self):
        return self.instance.content

    def format_content(self):
        self.send_message(self.user().nickname + ': ' + self.instance.content)
        return self.user().nickname + ': ' + self.instance.content

    def __str__(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【发言】' +  self.format_content()