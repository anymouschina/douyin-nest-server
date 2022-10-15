from mitmproxy import http


class UserInfoAddon:
    def __init__(self):
        ...

    def response(self, flow: http.HTTPFlow):
        # /aweme/v1/web/user/profile/other/ 他人主页获取他人信息
        if '/aweme/v1/web/user/profile/other' in flow.request.path:
            content = flow.response.content
