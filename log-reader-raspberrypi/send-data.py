import requests

f = open("output.txt","rt")
value = f.read()
print(value)

url = "http://localhost:3000/litres"

payload = {'id': 'U01', 'sta': 1, 'lit': value}
requests.post(url, json=payload)
