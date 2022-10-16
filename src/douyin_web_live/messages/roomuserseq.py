import time

from protobuf import message_pb2
from messages.base import Base

class RoomUserSeqMessage(Base):
    def __init__(self):
        self.instance = message_pb2.RoomUserSeqMessage()

    def extra_info(self):
        return {
            'total': self.instance.total,
        }

    def format_content(self):
        self.send_message('统计人数' + ': '  + self.instance.totalUserStr,'total')
        return self.instance.totalUserStr

    def __str__(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【观看人数】' + '当前在线：' + str(self.instance.total) + '，历史总计：' + self.format_content()