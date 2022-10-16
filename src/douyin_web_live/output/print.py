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
        print(msg)
        # print(f"\n{BLUE}[+] {msg} {RESET}")
    def like_output(self, msg):
        print(msg)
        # print(f"\n{CYAN}[+] {msg} {RESET}")
    def member_output(self, msg):
        print(msg)
        # print(f"\n{RED}[+] {msg} {RESET}")
    def social_output(self, msg):
        print(msg)
        # print(f"\n{GREEN}[+] {msg} {RESET}")

    def gift_output(self, msg):
        print(msg)
        # print(f"\n{MAGENTA}[+] {msg} {RESET}")

    def userseq_output(self, msg):
        print(msg)

        # print(f"\n{YELLOW}[+] {msg} {RESET}")

    def control_output(self, msg):
        print(msg)
        # print(f"\n{CYAN}[+] {msg} {RESET}")

    def fansclub_output(self, msg):
        print(msg)
        # print(f"\n{GREEN}[+] {msg} {RESET}")
