import argparse
import socket
import re
import sys
import os
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)

from packet import Packet

current_dir = ""
response_body = ""
status_line = "HTTP/1.0 "
status_codes = {200 : "200 OK \r\n",
                201 : "201 Created \r\n",
                        400: "400 Bad Request \r\n",
                        403 : "403 Forbidden\r\n",
                        404: "404 Not Found\r\n"}

debug_body = ""


def run_server(port):
    conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        conn.bind(('', port))
        print('UDP Server is listening at', port)
        buffer = []
        current = -1
        expected = 0
        while True:
            buffer = remove_dups(buffer)
            data, sender = conn.recvfrom(1024)
            p = Packet.from_bytes(data)
            print("GOT A PACKET")
            buffer.append(p)
            print("current buffer:", len(buffer))
       
            if p.packet_type == 0 or p.packet_type == 7:
                    p.payload = "--SYNACK--".encode("utf-8")
                    conn.sendto(p.to_bytes(), sender)
                    del buffer[0]
            else:
                if(p.seq_num == expected):
                    print("correct seq num: ",p.seq_num)
                    expected = check_packets(buffer)  
                else:
                    p.seq_num = expected
                    p.packet_type = 2
                    conn.sendto(p.to_bytes(), sender)
                    
                if(p.packet_type == 4):
                    print("FIN PACKET")
                    handle_client(conn, buffer, sender)
                    buffer.clear()
                    expected = 0
                    
                
    finally:
        conn.close()
def check_packets(packets):
    temp = set(packets)
    buffer = list(temp)
    buffer.sort(key=lambda x: x.seq_num)
    i = 0
    if len(buffer) == 0:
        return 0
    if buffer[0].seq_num != 0:
        return 0
    while i < len(buffer) - 1:
        if(buffer[i].seq_num != (buffer[i + 1].seq_num - 1)):
            return (buffer[i].seq_num + 1)
        i += 1
    
    return (buffer[-1].seq_num + 1)
def remove_dups(packets):
    if len(packets) == 0:
        return []
    packets.sort(key=lambda x: x.seq_num)
    i = 0
    while i < len(packets) -1:
        if(packets[i].seq_num == packets[i +1].seq_num):
            del packets[i]
        i += 1
    return packets
        
def handle_client(conn, data, sender):
    global response_body
    global status_line
    global status_codes
    global debug_body
    try:
        if len(data) == 1:       
            p = data[0]
            # print("Router: ", sender)
            # print("Packet: ", p)
            # print("Payload: ", p.payload.decode("utf-8"))
            requestInfo = p.payload.decode("utf-8")
            response = FileSystemManager(requestInfo)
            p.payload = response
            p.packet_type = 4
            # How to send a reply.
            # The peer address of the packet p is the address of the client already.
            # We will send the same payload of p. Thus we can re-use either `data` or `p`.
            conn.sendto(p.to_bytes(), sender)
        else:
            data.sort(key=lambda x: x.seq_num)
            data = remove_dups(data)
            info = ""
            for p in data:
                if(p.packet_type != 0):
                    info = info + p.payload.decode("utf-8")
                
            response = FileSystemManager(info)
            p = data[0]
            p.payload = response
            p.packet_type = 4
            conn.sendto(p.to_bytes(), sender)
    except Exception as e:
        print("Error: ", e)

def FileSystemManager(info):
    arr = info.split("HTTP/1.0")
    data = arr[-1].strip()
    temp = re.search('localhost:(.*)HTTP', info)
    path  =  temp.group(1)[4:].strip()
  
    if "GET" in info:
        if len(path) == 1:
            files = os.listdir(os.getcwd() + "/testFiles/")
            value = "\ndata:\n{\n" + "---Directory Content---:\n"
            for i in files:
                if "." in i:
                    value += "-F\t" + i + "\n"
                else:
                    value += "-D\t" + i + "\n"
            value += "\n}"
            return value.encode("utf-8")
        elif "." not in path:
            files = os.listdir(os.getcwd()+ "/testFiles" + path)
            value = "\ndata:\n{\n" + "---Directory Content---:\n"
            for i in files:
                if "." in i:
                    value += "-F\t" + i + "\n"
                else:
                    value += "-D\t" + i + "\n"
            value += "\n}" 
            return value.encode("utf-8")
        else:
            try:
                file = open(os.getcwd()+ "/testFiles" + path,'r')
                content = "\ndata:\n{\n---File Content---:\n"+file.read()
                content += "\n}"
                return content.encode('utf-8')
            except:
                return "ERROR STATUS:404 FILE NOT FOUND".encode('utf-8')
    else:
        try:   
            file = open(os.getcwd()+"/testFiles" +path,"w")
            file.write(data)
            file.close()
            return "SUCCESS STATUS:200 OK".encode('utf-8')
        except:
            return "ERROR STATUS:404 NOT FOUND".encode('utf-8')
    
        
        
        
            
        
        
        
        
        
        
        
        
# Usage python udp_server.py [--port port-number]
parser = argparse.ArgumentParser()
parser.add_argument("-p", help="echo server port", type=int, default=8007)
args, otherArgs = parser.parse_known_args()
if len(otherArgs) < 1:
    print("ERROR: INVALID COMMAND")
    quit()
if otherArgs[0] != "https":
    print("ERROR: INVALID COMMAND")
    quit()
run_server(args.p)
