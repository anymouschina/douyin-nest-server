import os
import time
import traceback

from config.helper import config
from output.IOutput import IOutput


class DebugWriter(IOutput):
    def __init__(self):
        # 获取对应配置文件
        self.unknown_output_dir = config()['output']['debug']['save_path']['unknown']
        if not os.path.isdir(self.unknown_output_dir):
            os.makedirs(self.unknown_output_dir)
        self.error_output_dir = config()['output']['debug']['save_path']['error']
        if not os.path.isdir(self.error_output_dir):
            os.makedirs(self.error_output_dir)

    def other_output(self, message_type: str, message_raw: bytes):
        if not os.path.isdir(os.path.join(self.unknown_output_dir, message_type)):
            os.makedirs(os.path.join(self.unknown_output_dir, message_type))
        with open(os.path.join(self.unknown_output_dir, message_type, str(time.time())), "wb") as f:
            f.write(message_raw)

    def error_output(self, message_type: str, message_raw: bytes, exception: Exception):
        if not os.path.isdir(os.path.join(self.error_output_dir, message_type)):
            os.makedirs(os.path.join(self.error_output_dir, message_type))
        ts = time.time()
        with open(os.path.join(self.error_output_dir, message_type, str(ts)), "wb") as f:
            f.write(message_raw)
        traceback.print_exc(file=open(os.path.join(self.error_output_dir, message_type, str(ts)) + ".exc", "w", encoding="UTF-8"))


