const net = require("net");
const HTTPResponse = require("./HTTPResponse").HTTPResponse;

module.exports.Server = class Server {
  constructor(port, directory, debugging) {
    this.socket = net.createServer();
    this.port = port;
    this.directory = directory;
    this.debugging = debugging;
    this.get = (entity) => {
      return entity;
    };
    this.post = (entity) => {
      return entity;
    };
  }

  start = async () => {
    this.socket.listen(this.port, "localhost", () => {
      console.log("Server Running on port: " + this.port);
    });

    this.socket.on("connection", (sock) => {
      console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);

      sock.on("data", async (data) => {
        let request = data
          .toString()
          .split("\r\n")
          .filter((e) => e);
        let httpData = new HTTPResponse(data.toString());
        let response = "";
       
        if (request[0].includes("POST")) {
          response = await this.post(httpData);
        } else {
          response = await this.get(httpData);
        }
        if (request[0].includes("POST")) {
          if (response.status === 200) {
            if (this.debugging) {
              sock.write(
                response.postMessage +
                  "**File was successfully written to/created!**\n"
              );
            } else {
              sock.write(response.postMessage);
            }
          } else {
            if (this.debugging && response.status === 403) {
              sock.write(
                response.error +
                  "**You tried accessing a directory/file that you don't have permissions for!**\n"
              );
            } else if (this.debugging && response.status === 404) {
              sock.write(
                response.error +
                  "**The directory/file you are trying to access does not exist!**\n"
              );
            } else {
              sock.write(response.error);
            }
          }
        } else {
          if (response.status === 200) {
            sock.write(response.response);
          } else {
            if (this.debugging && response.status === 403) {
              sock.write(
                response.error +
                  "**You tried accessing a directory/file that you don't have permissions for!**\n"
              );
            } else if (this.debugging && response.status === 404) {
              sock.write(
                response.error +
                  "**The directory/file you are trying to access does not exist!**\n"
              );
            } else {
              sock.write(response.error);
            }
          }
        }

        sock.destroy();
      });
    });
  };
};
