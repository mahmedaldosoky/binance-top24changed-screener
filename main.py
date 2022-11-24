from audioop import reverse
import requests
import json

response_API = requests.get("https://api.binance.com/api/v1/ticker/24hr")
coinsDataList = json.loads(response_API.text)
coinsDataList.sort(
    key=lambda json: int(float(json["priceChangePercent"])), reverse=True
)

usdtCoinsCounter = 0
for coin in coinsDataList:
    if coin["symbol"].endswith("USDT") and usdtCoinsCounter < 10:
        print(coin["symbol"] + " " + coin["priceChangePercent"])
        usdtCoinsCounter += 1
