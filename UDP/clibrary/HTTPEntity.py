

from operator import truediv
import re

class HTTPEntity:
    
    
        def __init__(self, data): 
            self.reqType = self.findType(data)
            self.verbose = self.checkVerbose(data)
            self.headers = self.checkHeaders(data)
            self.inlineData = self.checkInlineData(data)
            self.fileData = self.checkFile(data)
            self.url = self.getURL(data)
            self.validURL = "http" in self.url
    
        def findType(data):
            arr = data.split(" ")
            return "GET" if arr[0].lower() == 'get' else "POST"

        def checkVerbose(data):
            if '-v' in data:
                return True
            else:
                return False
        
        def checkHeaders(data):
            if '-h' in data:
                headers = re.search('-h(.*) -', data)
                headerString = headers.group(1)[1:]
                return headerString
            else:
                return None
        
        def checkInlineData(data):
            if '-d' in data:
                inlineData = re.search('-d \'(.*)\'', data)
                result = inlineData.group(1)
                return result
            else:
                return None
        
        def checkFile(data):
            if '-f' in data:
                if '-d' in data:
                    return None
                else:
                    input = re.search('-f (.*) http', data)
                    fileName = input.group(1)
                    try:
                        with open(fileName, 'r') as file:
                            fileData = file.read()
                            return fileData
                    except:
                        return None
            else:
                return None
        
        def getURL(data):
            arr = data.split(" ")
            return arr[len(arr -1)]
        
        
        
            
                    
                
