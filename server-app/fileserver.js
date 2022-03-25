#!/usr/bin/env node
"use strict";

const net = require("net");
const fs = require("fs");
const Server = require("../server-library/Server").Server;

const input = process.argv;
const data = input.slice(2);

let incorrect = false;
let debug = false;
let dir = null;
let port = 8080;
let correct = true;

if (incorrect) {
} else {
  if (data.length > 0) {
    switch (data[0].toLowerCase()) {
      case "help":
        console.log(
          "httpfs is a simple file server\n\nusage: httpfs [-v] [-p PORT] [-d PATH-TO-DIR]\n\n\t-v Prints debugging messages.\n\n\t-p Specifies the port number that the server will listen and serve at.\n\t\tDefault is 8080.\n\n\t-d Specifies the directory that the server will use to read/write\n\t\trequested files. Default is the current directory when\n\t\tlaunching the application\n"
        );
        correct = false;
        break;
      default:
        if(!data.includes('-v') && !data.includes('-p') && !data.includes('-d')){
          correct = false;
          break;
        }
        if (data.length > 5) {
          correct = false;
        }
        if (data.includes("-v")) {
          debug = true;
        }
        let index = data.findIndex((e) => e == "-p");
        if (index != -1) {
          port = data[index + 1];
          if (port.toString().length != 4) {
            correct = false;
          }
        }
        index = data.findIndex((e) => e === "-d");
        if (index != -1) {
          dir = data[index + 1];
        }
        break;
    }
  }

  if (dir != null && (dir.includes("..") || dir.charAt(0) != '/')) {
    correct = false;
  }
  let path = dir === null ? __dirname : __dirname + dir;
  if(!fs.existsSync(path)){
    correct = false;
    console.log("\nDirectory doesn't exist!");
  }
  if (correct) {
    const server = new Server(port, dir, debug);

    server.get = (httpData) => {
      let path = httpData.path;
      let list = [];
      let file = "";
      let directory = "";
      server.directory === null
        ? (directory = __dirname)
        : (directory = `${__dirname}${server.directory}`);

      if (path === "/") {
        let obj = { Files: list };
        fs.readdirSync(directory).forEach((file) => {
          if (file != "fileserver.js") {
            obj.Files.push(file);
          }
        });

        httpData.setData(obj);
      } else if (path.includes("..")) {
        httpData.setStatus(403, "Access Forbidden");
      } else {
        if (path.includes("fileserver.js")) {
          httpData.setStatus(403, "Access Forbidden");
          return httpData;
        }
        if (fs.existsSync(`${directory}${path}`)) {
          file = fs.readFileSync(`${directory}${path}`, "utf-8");
          let arr = path.split("/");
          let obj = {};
          let name = arr[arr.length - 1];
          obj[name] = file;
          httpData.setData(obj);
        } else {
          httpData.setStatus(404, "File Not Found");
        }
      }

      return httpData;
    };
    server.post = (httpData) => {
      let path = httpData.path;
      let directory = "";
      if (path.includes("..")) {
        httpData.setStatus(403, "Access Forbidden");
        return httpData;
      }
      server.directory === null
        ? (directory = __dirname)
        : (directory = `${__dirname}${server.directory}`);
      fs.writeFileSync(`${directory}${path}`, httpData.payloadData);
      httpData.setStatus(200);

      return httpData;
    };
    server.start();
  } else {

    if(port.toString().length != 4){
      console.log('\nERROR: Invalid Port\n');
    }
    else if (dir != null && (dir.includes("..") || dir.charAt(0) != '/')) {
      console.log("\nERROR: Invalid Directory\n");
    } else{
      console.log("\nCommand not Found:\t Try 'httpfs help' for all options\n");
    }
  }
}
