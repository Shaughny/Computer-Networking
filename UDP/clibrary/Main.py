import argparse
from ast import arg
import re
from Client import UDPClient

parser = argparse.ArgumentParser()
parser.add_argument("-v",action=argparse.BooleanOptionalAction, help="verbose", default=False)
parser.add_argument("-d",help="Inline Data to Send", metavar="", default=None)
parser.add_argument("-f",help="File name to Send",default=None)
parser.add_argument("-routerport", help="router port", type=int, default=3000)
# parser.add_argument("help")
parser.add_argument("-serverhost", help="server host", default="localhost")
parser.add_argument("-serverport", help="server port", type=int, default=8007)


args, otherArgs = parser.parse_known_args()
if otherArgs[0] != "httpc":
    print("Command not found\nUse httpc help for information")
elif otherArgs[1].upper() != "POST" and otherArgs[1].upper() != "GET":
    print("Command not found\nUse httpc help for information")   
elif "http" not in otherArgs[len(otherArgs)-1]:
    print("Command not found\nUse httpc help for information")
else:
    if "://" in otherArgs[-1]:
        data = otherArgs[-1].split("://")
        if ':' in data[1]:
            port = re.search('localhost:(.*)/', data[1])
            client = UDPClient("localhost",3000,"localhost",port.group(1)[0:4],args,otherArgs)
            client.runClient(args.d)
        else:
            print("INVALID COMMAND\nuse httpc help for information")
    else:
        print("Command not found\nUse httpc help for information")
    
    
