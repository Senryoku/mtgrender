import json
import requests
import urllib
import os

SymbolsURL = "https://api.scryfall.com/symbology"
SymbolsFile = "./client/src/assets/data/symbology.json"
SymbolsFolder = "./client/src/assets/img/symbols/"
Symbols = None

print("Downloading {}".format(SymbolsURL))
urllib.request.urlretrieve(SymbolsURL, SymbolsFile)
with open(SymbolsFile, 'r', encoding="utf8") as file:
    Symbols = json.load(file)["data"]
print("Done")

for symbol in Symbols:
    urllib.request.urlretrieve(symbol["svg_uri"], SymbolsFolder + symbol["svg_uri"][symbol["svg_uri"].rindex('/'):])
