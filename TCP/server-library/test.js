'use strict';


const net   = require('net');
const yargs = require('yargs');



const Server = require('./Server').Server;



const server = new Server(8080);

// server.get = (httpData)=>{
   
// }
server.post = (httpData)=>{

    httpData.setData({boo: "BAAAHHHH"});
    return httpData;
}
server.start();








// const argv = yargs.usage('node echoserver.js [--port port]')
//     .default('port', 8080)
//     .help('help')
//     .argv;

// const server = net.createServer(handleClient)
//     .on('error', err => {throw err; });

// server.listen({port: argv.port}, () => {
//   console.log('Echo server is listening at %j', server.address());
// });


// function handleClient(socket) {
//   console.log('New client from %j', socket.address());
//   socket
//       .on('data', buf => {
//         console.log(buf);
//         console.log("HEllo");
//         socket.write()
//         socket.destroy();
//       })
//       .on('error', err => {
//         console.log('socket error %j', err);
//         socket.destroy();
//       })
//       .on('end', () => {
//         socket.destroy();
//       });
// }