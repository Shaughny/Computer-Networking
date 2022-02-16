const net = require("net");
const yargs = require("yargs");

module.exports.Client = class Client {
  constructor(reqType, url) {
    this.reqType = reqType.toUpperCase();
    this.host = this.getHost(url);
    this.path = this.getPath(url);
    this.socket = net.createConnection({ host: this.host, port: 80 });
  }

  getHost = (url) => {
    let host = "";
    const arr = url.split("//");
    let end = arr[1].indexOf("/");
    if (end === -1) {
      return null;
    }
    host = arr[1].substring(0, end);
    return host;
  };
  getPath = (url) => {
    let path = "";
    const arr = url.split("//");
    let start = arr[1].indexOf("/");
    if (start === -1) {
      return null;
    }
    path = arr[1].substring(start);
    return path;
  };
};
