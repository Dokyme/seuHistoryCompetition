# this script formats the awsome papers from the word and puts it into thy mysql
import re
import pymysql #sudo pip install PyMySQL

multipleChoiceTextName="multipleChoiceListText"
judgementTextName="judgementListText"

class multipleChoice:

    def __init__(self,rawString):
        self.rawStr=rawString.decode("utf8")
        self.choice=[]
        self.id=0

    def parse(self):
        self.rawStr=self.rawStr.strip().replace(" ","").replace("\n","").replace(u"\u3000","")
        self.description=re.search(ur'[0-9]+(.*)([A-Da-d\uff21-\uff24].*){5}$',self.rawStr).group(1)
        self.description=re.search(ur"^[^\u4e00-\u9fa5]?((.|[\u4e00-\u9fa5])+)[^\u4e00-\u9fa5]?$",self.description).group(1) #questionDescription
        self.description,num=re.subn(ur'[\u0028|\uff08]$' , "",self.description)
        self.tempStr = self.rawStr.replace(self.description, "").replace(u"\u7b54\u6848","")
        result, num = re.subn(ur'[A-Da-d\uff21-\uff24]', "#", self.tempStr)
        result, num = re.subn(ur'^[0-9]*', "", result)
        p=re.compile(r'#')
        answerList=p.split(result)
        for il in answerList:
            if not re.search(ur'[0-9\uff10-\uff19\u4e00-\u9fa5]',il):
                answerList.remove(il)
        for il in answerList:
            if not re.search(ur'[0-9\uff10-\uff19\u4e00-\u9fa5]',il):
                answerList.remove(il)
        if len(answerList)>4:
            answerList.pop(0)
        for il in answerList:
            result,num =re.subn(ur'^[^\u4e00-\u9fa50-9\uff10-\uff19]',"",il)
            self.choice.append(result)
        return self

    def printAA(self):
         print "\n"+self.description
         for i in self.choice:
              print i
         print self.answer
         return self

    def findAnswer(self):
        #print re.search(ur'[ABCD\uff21\uff22\uff23\uff24]',self.tempStr).group(0)
        self.tempStr=re.sub(ur'[Aa\uff21]',"",self.tempStr,1)
        self.tempStr= re.sub(ur'[Bb\uff22]', "", self.tempStr, 1)
        self.tempStr = re.sub(ur'[Cc\uff23]', "", self.tempStr, 1)
        self.tempStr= re.sub(ur'[Dd\uff24]', "", self.tempStr, 1)
        self.tempStr=re.search(ur'[A-Da-d\uff21-\uff24]',self.tempStr).group(0)
        self.tempStr = re.sub(ur'[Aa\uff21]', "a", self.tempStr, 1)
        self.tempStr = re.sub(ur'[Bb\uff22]', "b", self.tempStr, 1)
        self.tempStr = re.sub(ur'[Cc\uff23]', "c", self.tempStr, 1)
        self.tempStr = re.sub(ur'[Dd\uff24]', "d", self.tempStr, 1)
        self.answer=self.tempStr
        return self

    def setId(self,id):
        self.id=id
        return self

class judgement:

    def __init__(self,rawString):
        self.rawStr=rawString.decode("utf8")
        self.description=""
        self.judge=0

    def parse(self):
        self.rawStr = self.rawStr.strip().replace(" ", "").replace("\n", "")
        self.description=re.search(ur'^[0-9]+[^0-9\u4e00-\u9fa5\uff10-\uff19]+(.*)[\uff08\u0028]',self.rawStr).group(1)
        tempStr=self.rawStr.replace(self.description,"")
        j=re.search(ur'[\u4e00-\u9fa5]',tempStr).group(0)
        if(j==u'\u5bf9'):
            self.judge=1
        elif(j==u'\u9519'):
            self.judge=0
        return self

    def printAA(self):
        print "\n"+self.description
        print self.judge
        return self

    def setId(self,id):
        self.id=id
        return self

multipleChoiceList=[]
file=open(multipleChoiceTextName)
linePlus=file.readline()
while True:
    line=file.readline()
    if not line:
        break
    if re.match(r'[0-9]+',line):
        multipleChoiceList.append(multipleChoice(linePlus))
        linePlus=line
        continue
    linePlus+=line

id=0

for line in multipleChoiceList:
    line.parse().setId(id).findAnswer().printAA()
    id+=1

judgementList=[]
file=open(judgementTextName)
linePlus=file.readline()
while True:
    line=file.readline()
    if not line:
        break
    if re.match(r'[0-9]+',line):
        judgementList.append(judgement(linePlus))
        linePlus=line
        continue
    linePlus+=line

id=0

for line in judgementList:
    line.parse().setId(id).printAA()
    id+=1


hMysql=pymysql.connect(host="localhost",
                        user="root",
                        password="459861",
                        db="seuHCDB",
                        charset="utf8")

try:

    with hMysql.cursor() as cursor:
        query="insert into multipleChoice (id,question_description,choice_a,choice_b,choice_c,choice_d,answer) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        for i in multipleChoiceList:
            cursor.execute(query,(i.id,i.description,i.choice[0],i.choice[1],i.choice[2],i.choice[3],i.answer))
            hMysql.commit()

    with hMysql.cursor() as cursor:
        query="insert into judgement (id,question_description,answer) VALUES (%s,%s,%s)"
        for i in judgementList:
            cursor.execute(query,(i.id,i.description,i.judge))
            hMysql.commit()

finally:
    hMysql.close()

