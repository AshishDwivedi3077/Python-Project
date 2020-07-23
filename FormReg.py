from flask import Flask, render_template,request,redirect
import json
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import os, uuid


app = Flask(__name__)

#with open("templates/JsonData/DataReg.json") as f:
 #   result = json.load(f)

#fields = result['analyzeResult']['documentResults'][0]['fields']

def listtodict(A, di):
   di = dict(A)
   return di

@app.route("/PostData",methods=['POST'])
def PostData():
    resp = request.form
    with open("templates/JsonData/Result-WorkspaceInspection" + str(resp['count']) + ".json") as f:
        result = json.load(f)
    fields = result['analyzeResult']['documentResults'][0]['fields']

    #cnt=resp['count']
    resp=request.form
    d={}
    resp=listtodict(resp,d)

    result['analyzeResult']['documentResults'][0]['fields'][resp['Labels']]['text'] = resp['answer']

    print(resp)
    print(resp['Labels'])
    a_file = open("templates/JsonData/Result-WorkspaceInspection" + str(resp['count']) + ".json", "w")
    json.dump(result, a_file)
    a_file.close()

    return resp
@app.route("/")
def home():
    return render_template("UpdateForm.html")

formno=0
@app.route("/LoadForm",methods=['GET','POST'])
def LoadForm():
    resp = request.form
    formno=resp['form']
    #img_path="static/Pdf_Images/WorkspaceInspection"+ str(formno) +"/WorkspaceInspection"+ str(formno) +"-"+ str(resp['page']) +".jpg";
    img_path=r"static\PdfFiles\WorkspaceInspection"+ str(formno) +".pdf";
    return img_path

def get_key(fields,val):
    for key, value in fields.items():
        if val == value:
            return key
    return "key doesn't exist"


@app.route("/UpdateGrid",methods=['GET','POST'])
def UpdateGrid():
    resp = request.form
    with open("templates/JsonData/Result-WorkspaceInspection"+ str(resp['page']) +".json") as f:
        result = json.load(f)
    fields = result['analyzeResult']['documentResults'][0]['fields']

    q = []
    a = []
    Name = result['analyzeResult']['documentResults'][0]['fields']['Name']
    Name = get_key(fields,Name)
    NameValue = result['analyzeResult']['documentResults'][0]['fields']['Name']['text']
    q.append(Name)
    a.append(NameValue)

    Name = result['analyzeResult']['documentResults'][0]['fields']['Employee Code']
    Name = get_key(fields,Name)
    NameValue = result['analyzeResult']['documentResults'][0]['fields']['Employee Code']['text']
    q.append(Name)
    a.append(NameValue)

    Name = result['analyzeResult']['documentResults'][0]['fields']['Company']
    Name = get_key(fields,Name)
    NameValue = result['analyzeResult']['documentResults'][0]['fields']['Company']['text']
    q.append(Name)
    a.append(NameValue)

    for i in range(1, 14, 1):
        Name = result['analyzeResult']['documentResults'][0]['fields']['question' + str(i)]
        Name = get_key(fields,Name)
        NameValue = result['analyzeResult']['documentResults'][0]['fields']['question' + str(i)]['text']
        q.append(Name)
        a.append(NameValue)



    for i in range(1, 19, 1):
        Name = result['analyzeResult']['documentResults'][0]['fields']['answer' + str(i)]
        for i in range(1, 19, 1):
            Name = result['analyzeResult']['documentResults'][0]['fields']['answer' + str(i)]
            if Name != None:
                Name = get_key(fields,Name)
                NameValue = result['analyzeResult']['documentResults'][0]['fields']['answer' + str(i)]['text']
                q.append(Name)
                a.append(NameValue)
            else:
                result['analyzeResult']['documentResults'][0]['fields']['answer' + str(i)] = {'type': 'string',
                                                                                              'valueString': '✔',
                                                                                              'text': '✔', 'page': 1,
                                                                                              'boundingBox': [],
                                                                                              'confidence': 0,
                                                                                              'elements': []}

                Name = get_key(fields,Name)
                NameValue = result['analyzeResult']['documentResults'][0]['fields']['answer' + str(i)]['text']
                q.append(Name)
                a.append(NameValue)

    a_file = open("templates/JsonData/Result-WorkspaceInspection"+ str(resp['page']) +".json", "w")
    json.dump(result, a_file)
    a_file.close()

    finalData = dict(zip(q, a))
    return finalData


@app.route("/Uploadtoblob",methods=['GET','POST'])
def Upload_to_blob():
    resp = request.form
    blob_service_client = BlobServiceClient.from_connection_string('DefaultEndpointsProtocol=https;AccountName=checklistform;AccountKey=dpZeiTIELCgVGxRxqYkhqAx42b8pWND2onchJ83+yXgHqbkMkPS5aKbmmVMtdDJdENFmmH3EuHhANmUQ02d7TQ==;EndpointSuffix=core.windows.net')

    local_path = "templates/JsonData/"
    local_file_name = "Result-WorkspaceInspection" + str(resp['count']) + ".json"
    upload_file_path = os.path.join(local_path, local_file_name)
    container_name = "edited"
    blob_client = blob_service_client.get_container_client(container=container_name)

    print("\nUploading to Azure Storage as blob:\n\t" + local_file_name)

    with open(upload_file_path, "rb") as data:
        blob_client.upload_blob("Result-WorkspaceInspection" + str(resp['count']) + ".json", data, overwrite=True)

    print("Uploaded to blob")
    return "saved in blob"



@app.route("/Downloadblob",methods=['GET','POST'])
def Downloadblob():

    blob_service_client = BlobServiceClient.from_connection_string('DefaultEndpointsProtocol=https;AccountName=checklistform;AccountKey=dpZeiTIELCgVGxRxqYkhqAx42b8pWND2onchJ83+yXgHqbkMkPS5aKbmmVMtdDJdENFmmH3EuHhANmUQ02d7TQ==;EndpointSuffix=core.windows.net')
    container_client = blob_service_client.get_container_client("analizedforms")

    local_path = "templates/AnalyzedJson/"
    #local_file_name = "Result-WorkspaceInspection1.txt"
    #upload_file_path = os.path.join(local_path, local_file_name)
    container_name = "analizedforms"

    analysed_Json = []

    blob_list = container_client.list_blobs()
    for blob in blob_list:
        analysed_Json.append(blob.name)

    print(analysed_Json)

    for f in analysed_Json:
        # local_file_name1=f
        download_file_path = os.path.join(local_path, str.replace(f, '.json', '.json'))

        with open(download_file_path, "wb") as my_blob:
            download_stream = container_client.download_blob(f)
            my_blob.write(download_stream.readall())
            print("downloaded  " + f)
    return "asdasdasdsad"

if __name__ == '__main__':
    app.run(debug=True)
