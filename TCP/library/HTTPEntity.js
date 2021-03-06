const fs = require("fs");

module.exports.HTTPEntity = class HTTPEntity {
  constructor(data,inline = null) {
    this.reqType = this.findType(data);
    this.verbose = this.checkVerbose(data);
    this.headers = this.checkHeaders(data);
    this.inlineData = this.checkInlineData(data,inline);
    this.fileData = this.checkFile(data);
    this.url = this.getURL(data);
    this.validURL = this.url.includes("http");
    this.oneDataSelected = this.checkOneData(data);
  }

  findType = (data) => {
    const arr = data.split(" ");
    return arr[0].toLowerCase() === "get" ? "GET" : "POST";
  };
  checkVerbose = (data) => {
    const arr = data.replace(/[']/g, "").split(" ");
    return arr[1] === "-v" ? true : false;
  };
  checkHeaders = (data) => {
    let headers = "";
    const arr = data.replace(/[']/g, "").split(" ");
    const start = arr.findIndex((e) => e === "-h");
    let end = arr.findIndex((e) =>  e.includes('-d'));
    if (end === -1) {
      end = arr.findIndex((e) => e === "-f");
    }
    if (end === -1) {
      end = arr.length - 1;
    }

    if (start === -1) {
      return headers;
    } else {
      let index = start + 1;
      while (index !== end) {
        headers += arr[index];
        index++;
      }
    }
    return headers;
  };

  checkInlineData = (data,inline) => {
    if(inline != null){
      return inline;
    }
    let inlineData = "";
    const arr = data.replace(/[']/g, "").split(" ");
    let start = arr.findIndex((e) => e.includes('-d'));
    let end = arr.length - 1;
    if (start === -1) {
      return inlineData;
    }
    let index = start + 1;
    while (index !== end) {
      inlineData += arr[index];
      index++;
    }
    return inlineData;
  };
  checkFile = async (data) => {
    let fileData = "";
    const arr = data.replace(/[']/g, "").split(" ");
    let inline = arr.findIndex((e) => e === "-d");
    if (inline != -1) {
      return fileData;
    }
    let start = arr.findIndex((e) => e === "-f");
    if (start === -1) {
      return fileData;
    }
    let temp = fs.readFileSync(arr[start + 1],"utf-8");
    this.inlineData = temp;
    return fileData;
  };
  getURL = (data) => {
    const arr = data.replace(/[']/g, "").split(" ");
    return arr[arr.length - 1];
  };
  checkOneData = (data) => {
    const arr = data.replace(/[']/g, "").split(" ");
    let checkD = arr.findIndex(e=>e==='-d');
    let checkF = arr.findIndex(e=>e==='-f');

    if(checkD > -1 && checkF > -1){
        return false;
    }
    return true;
  }
  
};
