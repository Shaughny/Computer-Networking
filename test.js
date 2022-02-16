// #!/usr/bin/env node

// const Client = require('./library/Client');
// const HTTPEntity = require('./library/HTTPEntity');
// const Application = require('./library/Main');
// const RequestData = HTTPEntity.HTTPEntity;
// const Clients = Client.Client;
// const App = Application.app;

// const temp = JSON.stringify({Name: "Mark",Age: 24});
// const fake = `POST /post HTTP/1.0\r\nContent-Type:application/json\r\nContent-Length:${temp.length}\r\n\r\n${temp}\r\n`
// // const request = new RequestData(`post -h Content-Type:application/json -d '{"Assignment": 1}' http://httpbin.org/post`);


// // const clientObj = new Clients(request.reqType,request.url);

// const test = process.argv;
// const data = test.slice(2);

// const request = new RequestData(data.join(' '));

// const app = new App(request);

// app.run();