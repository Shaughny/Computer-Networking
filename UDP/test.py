# import re
# import os

# file = open(os.getcwd()+ '/wiki.txt','r')
# content = file.read()
# content = content.encode('utf-8')
# print(len(content))
# def chunkstring(string, length):
#     return (string[0+i:length+i] for i in range(0, len(string), length))

# print(len(list(chunkstring(content,1014))))
class testing:
    def __init__(self,name,age):
        self.name = name
        self.age = age
    
one = testing("Mark", 24)
two = testing("Sean",24)
three = testing("Anthony", 34)
four = testing("Joe", 12)
mylist = [one,two,three,four]

print(mylist)
# sorted(mylist, key=lambda x: x.age)
mylist.sort(key=lambda x: x.age)
for j in mylist:
    print(j.name," ",j.age)

# temp = set(mylist)
# mylist = list(temp)

# print(mylist)