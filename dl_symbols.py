import json
import requests
import urllib
import os

SymbolsURL = "https://api.scryfall.com/symbology"
SymbolsFile = "./data/symbology.json"
ProcessedSymbolsFile = "./client/src/assets/data/symbology.json"
SymbolsFolder = "./client/src/assets/img/symbols/"
Symbols = None

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0'), ('Accept', '*/*')]
urllib.request.install_opener(opener)

print("Downloading {}".format(SymbolsURL))
urllib.request.urlretrieve(SymbolsURL, SymbolsFile)
with open(SymbolsFile, 'r', encoding="utf8") as file:
    Symbols = json.load(file)["data"]
print("Done")


for symbol in Symbols:
    filename = symbol["svg_uri"][symbol["svg_uri"].rindex('/'):]
    path = SymbolsFolder + filename
    if not os.path.exists(path):
        urllib.request.urlretrieve(symbol["svg_uri"], path)
    symbol["svg_uri"] = filename


with open(ProcessedSymbolsFile, 'w', encoding="utf8") as file:
    json.dump(Symbols, file)
