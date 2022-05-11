# UDP Client and Server File Manager

   Remote file system using a UPD Client and Server that allows for simple GET and POST requests using the Packet class.

   The Client and Server interact through the custom Router that will route the packets between them and also simulate packet loss/delay.

   The Packet class determines a max packet size of 1014 bytes in total. 
    
   The Remote file system uses a custom UDP library to allow for guaranteed delivery of packets and data integrity. 
    
## Usage Examples:

### Router:

**Reliable Transport:**

    go run router.go --port=3000 --drop-rate=0 --max-delay=0ms –seed=1

**With Drop Rate**

    go run router.go --port=3000 –drop-rate=0.2 --max-delay=0ms –seed=1

**With Drop Rate and Delay**

    go run router.go --port=3000 –drop-rate=0.2 --max-delay=10ms –seed=1


### Client

**GET:**

    python3 Main.py httpc GET 'http://localhost:{PORT}/{Filename.extension/Directory}/'

    python3 Main.py httpc GET 'http://localhost:{PORT}/'

  

**POST:**

    python3 Main.py httpc POST -d "{Message}" 'http://localhost:{PORT}/{Filename.extension/Directory}/'
    python3 Main.py httpc POST -f  {Filename.extension} 'http://localhost:{PORT}/{Filename.extension/Directory}/'

### Server
    python3 server.py https -p {PORT}

