

module.exports.HTTPResponse = class HTTPResponse {
    constructor(data,port = 8080) {
      this.status = 200;
      this.message = '';
      this.postMessage = `HTTP/1.0 ${this.status}\nServer: localhost\nDate: ${new Date().toLocaleDateString()}\n${this.headers}\nConnection: close\nAccess-Control-Allow-Origin: *\n\nSTATUS: 200 OK\tOperation Successful`;
      this.error = `HTTP ERROR ${this.status}\t ${this.message}`;
      this.path = this.findPath(data);
      this.reqType = data.split('\r\n').filter(e => e)[0].split(' ')[0];
      this.url = '';
      this.headers = this.findHeaders(data);
      this.headerObject = this.findHeaderObject(data,port);
      this.arguments = this.findArguments(data,port);
      this.payloadData = this.findData(data);
      this.json = this.findJSON(data);
      this.postData = {args: this.arguments,data: this.payloadData,files: {}, form: {},headers: this.headerObject,json: this.json,url:this.url};
      this.getData = {args: this.arguments,data: this.payloadData ,headers: {'Host':"localhost",'User-Agent':"445serverlibrary-HTTP/1.0"},url: this.url};
      this.response = `HTTP/1.0 ${this.status}\nServer: localhost\nDate: ${new Date().toLocaleDateString()}\n${this.headers}\nConnection: close\nAccess-Control-Allow-Origin: *\n\n${JSON.stringify(this.getData, null, 4)}`;
      
    }
    

   findHeaders = (data) => {
     let arr = data.split('\r\n').filter(e => e);
     let result = '';
     let obj = {}
     for(let i = 1;i<arr.length;i++){
         if(arr[i].includes('{')){
             break;
         }
            result += arr[i] + '\n';
            let temp = arr[i].split(':');
            let a = temp[0];
            let b = temp[1];
            obj[a] = b;
        if(a === 'Content-Length'){
            break;
        }
     }
     result = result.substring(0,result.length-2);
     this.headerObject = obj;
     return result;
   }
   findHeaderObject = (data, port) => {
    let arr = data.split('\r\n').filter(e => e);
    let obj = {}
    obj['Host'] = `localhost`;
    for(let i = 1;i<arr.length;i++){
        if(arr[i].includes('{')){
            break;
        }
           let temp = arr[i].split(':');
           let a = temp[0];
           let b = temp[1];
           obj[a] = b;
           if(a === 'Content-Length'){
            break;
        }
    }
    return obj
   }
   findPath = (data) => {
    let arr = data.split('\r\n').filter(e => e)[0].split(' ');
    return arr[1];
   }
   findArguments = (data,port) => {
       let arr = data.split('\r\n').filter(e => e)[0].split(' ');
       let obj = {};
       this.url = `http://localhost:${port}${arr[1]}`;
       if(arr[1] === '/'){
           return {};
       }else if(!arr[1].includes('?')){
           return {};
       }
       else{
           let index = arr[1].indexOf('?');
           let argData = arr[1].substring(index +1);
           if(argData.includes('&')){
               let argArray = argData.split('&');
               argArray.forEach( e => {
                   let temp = e.split('=');
                   obj[temp[0]] = temp[1];
               })
           }else{
               let temp = argData.split('=');
               obj.temp[0] = temp[1];
           }
           
       }
       return obj;
   }
   findData = (data) => {
    let arr = data.split('\r\n').filter(e => e);
    let index = -1;
    for(let i = 1;i<arr.length;i++){
        if(arr[i].includes('{')){
            index = i;
            break;
        }
        if(arr[i].includes('Content-Length:')){
            index = i+1;
            break;
        }
    }
    if(index < 0){
        return {};
    }
      this.json = arr[index];
      return arr[index];

   }
   findJSON = (data) => {
    let arr = data.split('\r\n').filter(e => e);
    let index = -1;
    for(let i = 1;i<arr.length;i++){
        if(arr[i].includes('{')){
            index = i;
            break;
        }
        
    }
    if(index < 0){
        return {};
    }
      this.json = arr[index];
      return JSON.parse(arr[index]);
   }
   setStatus = (code,message) => {
        this.status = code;
        this.message = message;
        this.refresh();
   }
   setData = (payload) => {
        this.getData.json = payload;
        this.getData.data = JSON.stringify(payload);
        this.refresh();

   }
   refresh = () => {
    this.response = `HTTP/1.0 ${this.status}\nServer: localhost\nDate: ${new Date().toLocaleDateString()}\n${this.headers}\nConnection: close\nAccess-Control-Allow-Origin: *\n\n${JSON.stringify(this.getData, null, 4)}`;
    this.error = `HTTP/1.0 ${this.status}\nServer: localhost\nDate: ${new Date().toLocaleDateString()}\n${this.headers}\nConnection: close\nAccess-Control-Allow-Origin: *\n\nHTTP ERROR ${this.status}:\t ${this.message}\n`;
    this.postMessage = `HTTP/1.0 ${this.status}\nServer: localhost\nDate: ${new Date().toLocaleDateString()}\n${this.headers}\nConnection: close\nAccess-Control-Allow-Origin: *\n\nSTATUS: 200 OK\tOperation Successful`;
   }
    
  };
  