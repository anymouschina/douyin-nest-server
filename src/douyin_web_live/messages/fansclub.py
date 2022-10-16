import time

from protobuf import message_pb2
from messages.base import Base

class FansclubMessage(Base):
    def __init__(self):
        self.instance = message_pb2.FansclubMessage()

    def format_content(self):
        self.send_message(self.user().nickname + ': '  + self.instance.content,'fansclub')
        return self.instance.content

    def __str__(self):
        if self.instance.type == 2:
            return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【加入粉丝团】' +  self.format_content()
        elif self.instance.type == 1:
            return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【粉丝牌升级】' +  self.format_content()
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【粉丝团信息】' + self.format_content()