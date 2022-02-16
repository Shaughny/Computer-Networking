
const fs = require('fs');


module.exports.HTTPEntity = class HTTPEntity{

    constructor(data){
    this.reqType = this.findType(data);
    this.verbose = this.checkVerbose(data);
    this.headers = this.checkHeaders(data);
    this.inlineData = this.checkInlineData(data);
    this.fileData = this.checkFile(data);
    this.url = this.getURL(data);
    this.validURL = this.url.includes('http');

    }
   
    findType = (data) =>{
        const arr = data.split(' '); 
        return( (arr[0].toLowerCase() === 'get') ? 'GET' : 'POST')
    }
    checkVerbose = (data) => {
        const arr = data.replace(/[']/g, '').split(' ');
        return( (arr[1] === '-v') ? true : false);
    }
    checkHeaders = (data) => {
        let headers = '';
        const arr = data.replace(/[']/g, '').split(' ');
        const start = arr.findIndex(e => e === '-h');
        let end = arr.findIndex(e => e === '-d');
        if(end === -1){
            end = arr.findIndex(e => e === '-f');
        }
        if(end === -1){
            end = arr.length -1;
        }


        if(start === -1){
            return headers;
        }else{
            let index = start +1;
            while(index !== end){
                headers += arr[index];
                index++;
            }
        }
        return headers;
    }

    checkInlineData = (data) => {
        let inlineData = '';
        const arr = data.replace(/[']/g, '').split(' ');
        let start = arr.findIndex(e=>e==='-d');
        let end = arr.length -1;
        if(start === -1){
            return inlineData;
        }
        let index = start + 1;
        while(index !== end){
            inlineData += arr[index];
            index++;
        }
       return inlineData;
     
    }
    checkFile = (data) => {
        let fileData = '';
        const arr = data.replace(/[']/g, '').split(' ');
        let inline = arr.findIndex(e=>e==='-d');
        if(inline != -1){
            return fileData;
        }
        let start = arr.findIndex(e=>e==='-f');
        if(start === -1){
            return fileData;
        }
        fs.readFile(arr[start + 1], 'utf-8', (err, data)=>{

            fileData = data;
        });
        return fileData;

    }
    getURL = (data) => {
        const arr = data.replace(/[']/g, '').split(' ');
        return arr[arr.length -1];
    }


}