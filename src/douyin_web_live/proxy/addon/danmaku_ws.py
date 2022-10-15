import re

from proxy.common import MessagePayload
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mitmproxy import http
    from queue import SimpleQueue


class DanmakuWebsocketAddon:
    def __init__(self, queue: "SimpleQueue[MessagePayload]"):
        self._queue = queue

    def websocket_message(self, flow: "http.HTTPFlow"):
        re_c = re.search('webcast\d-ws-web-.*\.douyin\.com', flow.request.host)
        if re_c:
            message = flow.websocket.messages[-1]
            if message.from_client:
                return
            payload = MessagePayload(message.content)
            payload.request_url = flow.request.url
            payload.request_query = flow.request.query
            self._queue.put(payload)
