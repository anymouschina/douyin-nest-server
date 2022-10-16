from colorama import init, Fore

from output.IOutput import IOutput

RED = Fore.RED
GREEN = Fore.GREEN
BLUE = Fore.BLUE
CYAN = Fore.CYAN
MAGENTA = Fore.MAGENTA
YELLOW = Fore.YELLOW
WHITE = Fore.WHITE
RESET = Fore.RESET
init()
class Print(IOutput):
    def chat_output(self, msg):
        # print(f"\n{BLUE}[+] {msg} {RESET}")
        return
    def like_output(self, msg):
        # print(f"\n{CYAN}[+] {msg} {RESET}")
        return
    def member_output(self, msg):
        # print(f"\n{RED}[+] {msg} {RESET}")
        return
    def social_output(self, msg):
        # print(f"\n{GREEN}[+] {msg} {RESET}")
        return

    def gift_output(self, msg):
        # print(f"\n{MAGENTA}[+] {msg} {RESET}")
        return

    def userseq_output(self, msg):
        # print(f"\n{YELLOW}[+] {msg} {RESET}")
        return


    def control_output(self, msg):
        # print(f"\n{CYAN}[+] {msg} {RESET}")
        return

    def fansclub_output(self, msg):
        # print(f"\n{GREEN}[+] {msg} {RESET}")
        return
