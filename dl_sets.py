import json
import requests
import urllib
import multiprocessing
import logging
import threading
import os
from PIL import Image

SetsURL = "https://api.scryfall.com/sets"
SetsFile = "./client/src/assets/data/sets.json"
MTGSets = {}
IconsFolder = "./client/src/assets/img/set_icons/"

print("Downloading {}".format(SetsURL))
urllib.request.urlretrieve(SetsURL, SetsFile)
with open(SetsFile, 'r', encoding="utf8") as file:
    MTGSets = json.load(file)["data"]
print("Done")


def dl_set_icon(mtgset):
    logging.info("Thread %s: starting", mtgset["code"])
    for rarity in ["common", "uncommon", "rare", "mythic", "special"]:
        icon_url = "https://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set={}&size=large&rarity={}".format(mtgset["code"],
                                                                                                                     "T" if rarity == "special" else rarity[0])
        icon_path = IconsFolder + mtgset["code"] + "_" + rarity + ".png"

        if not os.path.exists(icon_path):
            # print("\t{}".format(icon_url))
            urllib.request.urlretrieve(icon_url, icon_path)
            if os.path.getsize(icon_path) == 0:
                os.remove(icon_path)
            else:
                try:
                    #print("\tTriming {}".format(mtgset["code"] + "_" + rarity))
                    im = Image.open(icon_path)
                    # im.crop(im.getbbox()).save(icon_path)
                except:
                    print("Error trimming {}".format(icon_path))
    logging.info("Thread %s: finishing", mtgset["code"])


threads = list()
for mtgset in MTGSets:
    #print("Downloading {} icons...".format(set["code"]))
    x = threading.Thread(target=dl_set_icon, args=(mtgset,))
    threads.append(x)
    x.start()

for index, thread in enumerate(threads):
    thread.join()

SetsWithIcons = set()
for icon in os.listdir(IconsFolder):
    set_code = icon[0: icon.index("_")]
    SetsWithIcons.add(set_code)
with open("./client/src/assets/data/sets_with_icons.json", 'w', encoding="utf8") as outfile:
    json.dump(list(SetsWithIcons), outfile)
