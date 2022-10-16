import time

from protobuf import message_pb2
from messages.base import Base

class GiftMessage(Base):
    def __init__(self):
        self.instance = message_pb2.GiftMessage()

    def extra_info(self):
        return {
            'giftId': self.instance.gift.id,
            'giftName': self.instance.gift.name,
            'giftCount': self.instance.repeatCount,
            'diamondCount': self.instance.gift.diamondCount,
        }

    @property
    def gift(self):
        return self.instance.gift

    def format_content(self):
        self.send_message(self.user().nickname + ': ' + self.instance.common.describe,'gift')
        return self.instance.common.describe

    def __str__(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '【送礼】' + self.format_content()