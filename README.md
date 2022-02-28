# cUrl-like program for making GET and POST Requests



# Requirements

1. You need install node 4.2.1 or later
2. Run `npm install` to install dependencies

# Usage

`npm run httpc <query>`

## Examples: 

### HELP:

`npm run httpc help`

`npm run httpc help get`

`npm run httpc help post`

### GET: 

`npm run httpc get 'http://httpbin.org/get?name=Mark&country=Canada'`

### POST:

`npm run httpc post -h Content-Type:application/json -d '{"Name": Mark}' http://httpbin.org/post`
