import time

from protobuf import message_pb2
from messages.base import Base

class SocialMessage(Base):
    def __init__(self):
        self.instance = message_pb2.SocialMessage()

    def format_content(self):
        nickname = self.user().nickname
        self.send_message( nickname+ ': '   + ' 关注了主播','social')
        return nickname + ' 关注了主播'

    def __str__(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【关注】' +  self.format_content()