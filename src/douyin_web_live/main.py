import atexit
import signal

from browser.manager import init_manager as init_browser_manager
from output.manager import OutputManager
from proxy.manager import init_manager as init_proxy_manager

if __name__ == '__main__':
    proxy_manager = init_proxy_manager()
    proxy_manager.start_loop()
    browser_manager = init_browser_manager()
    output_manager = OutputManager()


    def terminate(*_):
        print("terminate")
        browser_manager.terminate()
        output_manager.terminate()
        proxy_manager.terminate()


    atexit.register(terminate)
    signal.signal(signal.SIGTERM, terminate)
    signal.signal(signal.SIGINT, terminate)
    output_manager.start_loop()
    try:
        proxy_manager.join()
    finally:
        terminate()
