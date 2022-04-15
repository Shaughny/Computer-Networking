import argparse
import sys
import os
import time

currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
import ipaddress
import socket

from packet import Packet

class UDPClient:
    
    def __init__(self,routerAdd,routerPort,serverAdd,serverPort,kargs,uargs):
        self.peer_ip = ipaddress.ip_address(socket.gethostbyname(serverAdd))
        self.connection = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.router_address = routerAdd
        self.router_port = routerPort
        self.server_port = serverPort
        self.data = self.parseBody(kargs,uargs)
    
    def runClient(self,data):
        message = self.data
        i = 0
        handshake = Packet(packet_type=0,seq_num=0,peer_ip_addr=self.peer_ip,peer_port=self.server_port,payload="connect".encode("utf-8"))
        print("Sent SYN")
        while i < 20 and i != -1:  
            try:
                self.connection.sendto(handshake.to_bytes(),(self.router_address, self.router_port))
                self.connection.settimeout(1)
                print('Waiting for a SYNACK')
                response, sender = self.connection.recvfrom(1024)
                print(response.decode('utf-8'))
                i = -1
            except socket.timeout:
                 print('No response')
                 i += 1
        j = 0
        if i ==20:
            quit()
        print('Sent ACK')
        handshake.packet_type =7;    
        while j < 20 and j != -1:  
            try:
                self.connection.sendto(handshake.to_bytes(),(self.router_address, self.router_port))
                self.connection.settimeout(1)
                
                response, sender = self.connection.recvfrom(1024)
                j = -1
            except socket.timeout:
                 j += 1
        j = 0
        
        
        
        packets = self.createPackets()
    
        while True:   
            for p in packets:
                try:
                    # print("sending packet", p.seq_num)
                    self.connection.sendto(p.to_bytes(),(self.router_address, self.router_port))
                    self.connection.settimeout(0.5)
                    response, sender = self.connection.recvfrom(1024)
                    pack = Packet.from_bytes(response)
                    if(pack.packet_type == 4):
                        print(pack.payload.decode("utf-8"))
                        quit()
                    else:
                        # print("resending ",pack.seq_num)
                        self.connection.sendto(packets[pack.seq_num].to_bytes(),(self.router_address, self.router_port))
                        self.connection.settimeout(0.5)
                except socket.timeout:
                    pass
                
    def parseBody(self,kargs,uargs):  
        if kargs.d != None:
            result = "{} {} HTTP/1.0\r\n\r\n{}\r\n".format(uargs[1].upper(),uargs[-1],kargs.d)
        elif kargs.f != None:
            parent = os.path.dirname(os.getcwd())
            try:
                with open(parent + "/" + kargs.f, 'r') as file:
                    fileData = file.read()
                  
                result = "{} {} HTTP/1.0\r\n\r\n{}\r\n".format(uargs[1].upper(),uargs[-1],fileData)  
            except:
                    print("File Not Found!")
                    quit()

        else:
            result = "{} {} HTTP/1.0\r\n".format(uargs[1].upper(),uargs[-1])
        return result
    
    def createPackets(self):
        packList = []
        if len(self.data.encode('utf-8')) < 1014:
            packet = Packet(packet_type=4,
                                seq_num=0,
                                peer_ip_addr=self.peer_ip,
                                peer_port=self.server_port,
                                payload=self.data.encode("utf-8"))
            packList.append(packet)
            return packList
        currentData = self.data.encode('utf-8')
        result = self.chunkstring(currentData,1013)
        i = 0
        while i < len(result):
            pack = Packet(packet_type=2,
                                seq_num=i,
                                peer_ip_addr=self.peer_ip,
                                peer_port=self.server_port,
                                payload=result[i])
            packList.append(pack)
            i += 1
       
        
        packList[-1].packet_type=4
        return packList
        
    def chunkstring(self,string, length):
        return list((string[0+i:length+i] for i in range(0, len(string), length)))
         