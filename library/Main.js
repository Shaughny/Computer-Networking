const Client = require('./Client');
const HTTPEntity = require('./HTTPEntity');
const RequestData = HTTPEntity.HTTPEntity;
const Clients = Client.Client;

module.exports.app = class Application{

    constructor(Request){
        this.request = Request;
        this.Client = null;

    }

    run = () => {

            let request = this.request;
            this.Client = new Clients(this.request.reqType,this.request.url);

            this.Client.socket.on('connect', () => {
                console.log('Connection Established\n');
                this.Client.socket.write(`${request.reqType} ${this.Client.path} HTTP/1.0\r\n${request.headers}\r\nContent-Length:${request.inlineData.length}\r\n\r\n${request.inlineData}\r\n`);
            });

            this.Client.socket.on('data', buf =>{
                let data = buf.toString('utf-8');
                 console.log("--------SERVER RESPONSE--------:\n");
                const end = data.indexOf('{');
                const verboseData = data.substring(0,end);
                const nonVerboseData = data.substring(end);
               
                if(this.request.verbose === true){
                    console.log(verboseData);
                }
                console.log(nonVerboseData);
            })
    }



}