'use strict';

const net = require('net');
const yargs = require('yargs');
const Client = require('./library/Client');
const HTTPEntity = require('./library/HTTPEntity');
const Clients = Client.Client;
const RequestData = HTTPEntity.HTTPEntity;
const argv = yargs.usage('node echoclient.js [--host host] [--port port]')
    .default('host', 'localhost')
    .default('port', 8007)
    .help('help')
    .argv;

const options = {
  host: 'httpbin.org',
  port: 80
};

console.log(options)

// const client = net.createConnection(options);
const clientObj = new Clients("GET", '/get','httpbin.org');
const client = clientObj.socket;
const requests = [];

/**
 * Request
 */
client.on('connect', () => {
  console.log('Type any thing then ENTER. Press Ctrl+C to terminate');
  const params = {
    assignment: 1,
    course: 'networking'
  };

//   const command = `GET /get?course=networking&assignment=1 HTTP/1.0\r\n`;
  const temp = JSON.stringify({Name: "Mark",Age: 24});
  //POST
  const command = `POST /post?course=networking&assignment=1&idiot=me HTTP/1.0\r\nAccept-Language: en-US,en;q=0.5\r\nContent-Length:${temp.length}\r\n\r\n${temp}\r\n`;
  //GET



  const getCommand = `GET /get?course=networking&assignment=1&idiot=me HTTP/1.0\r\nAccept-Language: en-US,en;q=0.5\r\n\r\n`;
  const comm = "GET /get\n";
//   client.write(command);

    requests.push({
    sendLength: getCommand.byteLength,
    response: new Buffer(0)
        });
  client.write(getCommand);
  
//   process.stdin.on('readable', () => {
//     let chunk =  process.stdin.read();
   
//     console.log(chunk);
//     chunk = Buffer.from(chunk,'utf-8');
//     // chunk =+ "\n Connection: keep-alive"
//     if (chunk != null) {
//       requests.push({
//         sendLength: chunk.byteLength,
//         response: new Buffer(0)
//       });
//       client.write(chunk);
//     }
//   });
});

/**
 * Response
 */
client.on('data', buf => {
//   if (requests.length == 0) {
//     client.end();
//     process.exit(-1);
//   }
  
  console.log('Server replied: ', buf.toString("utf-8"))
  // const r = requests[0];
  // r.response = Buffer.concat([r.response, buf]);
  // if(r.response.byteLength >= r.sendLength){
  //   requests.shift();
  //   console.log("Server replied:\n\n" + r.response.toString("utf-8") + '\n')
  // }
});

client.on('error', err => {
  console.log('socket setup error')
  console.log(JSON.stringify(err, null, 2));
  process.exit(-1);
});

client.on('close', err => {
  console.log('Good bye!');
  process.exit(-1);
});