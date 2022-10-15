import time

from messages.base import Base
from protobuf import message_pb2


class ControlMessage(Base):
    def __init__(self):
        self.instance = message_pb2.ChatMessage()

    def __str__(self):
        # 基本上都是下播了，比如主播离开了，违规被Ban了啥的，有这个消息，直播间信息必然发生变化
        self.send_message('系统消息'+ ': '  + '直播间异常')
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【直播间信息】'
