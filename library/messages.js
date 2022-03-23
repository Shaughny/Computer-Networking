const helpMessages = {
  general: `\nhttpc is a curl-like application but supports HTTP protocol only.\n
    Usage:\t httpc command [arguments]\n 
    The commands are:\n
    \tget \t\texecutes a HTTP GET request and prints the response.\n
    \tpost \t\texecutes a HTTP POST request and prints the response.\n
    \thelp \t\tprints this screen.\n
    Use "httpc help [command]" for more information about a command.\n`,
  get: `\nUsage:\t httpc get [-v] [-h key:value] URL\n\n
    Get executes a HTTP GET request for a given URL.\n\n
    \t-v      \t\t Prints the detail of the response such as protocol, status and headers.\n
    \t-h key:value \t\t Associates headers to HTTP Request with the format 'key:value'.\n`,
  post: `\nUsage:\t httpc post [-v] [-h key:value] [d inline-data] [-f file] URL\n\n
    Post executes a HTTP POST request for a given URL with inline data or from a file.\n\n
    \t-v       \t\t Prints the detail of the response such as protocol, status and headers.\n
    \t-h key:value \t\t Associates headers to the HTTP Request with the format 'key:value'.\n
    \t-d string \t\t Associates an inline data to the body of the HTTP POST request.\n
    \t-f file \t\t Associates the content of a file to the body of a HTTP POST request.\n

    Either [-d] or [-f] can be used but not both.\n `,
};

module.exports = {
  helpMessages,
};
