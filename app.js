#!/usr/bin/env node

const HTTPEntity = require("./library/HTTPEntity");
const Application = require("./library/Main");
const RequestData = HTTPEntity.HTTPEntity;
const App = Application.app;
const { helpMessages } = require("./library/messages");
const temp = JSON.stringify({ Name: "Mark", Age: 24 });
const fake = `POST /post HTTP/1.0\r\nContent-Type:application/json\r\nContent-Length:${temp.length}\r\n\r\n${temp}\r\n`;

const input = process.argv;
const data = input.slice(2);

const sendRequest = () => {
  const request = new RequestData(data.join(" "));
  if(!request.oneDataSelected){
      console.log("\nINVALID QUERY: Only one option of [-d] or [-f] can be used in a request\n");
      return;
  }
  const app = new App(request);
  app.run();
};

switch (data[0].toLowerCase()) {
  case "help":
    if (data.length > 1) {
      switch (data[1].toLowerCase()) {
        case "get":
          console.log(helpMessages.get);
          break;
        case "post":
          console.log(helpMessages.post);
          break;
      }
    } else {
      console.log(helpMessages.general);
    }
    break;
  case "get":
    sendRequest();
    break;
  case "post":
    sendRequest();
    break;
  default:
    console.log("\nCommand not Found\n");
    break;
}
