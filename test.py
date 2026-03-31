import urllib.request
import json

data = json.dumps({"n": 50, "p": 0.5, "k": 25}).encode('utf-8')
req = urllib.request.Request("http://localhost:8000/api/calculate", data=data, headers={"Content-Type": "application/json"})

try:
    response = urllib.request.urlopen(req)
    print("SUCCESS")
except Exception as e:
    print("FAILED:", e)
