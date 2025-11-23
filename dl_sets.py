import json
import requests
import urllib
import os
from PIL import Image
import time
from requests.adapters import HTTPAdapter, Retry

SetsURL = "https://api.scryfall.com/sets"
SetsFile = "./client/src/assets/data/sets.json"
MTGSets = {}
IconsFolder = "./client/src/assets/img/set_icons/"


session = requests.Session()
session.headers.update(
    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/115.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
    }
)
retries = Retry(total=3, backoff_factor=0.5, status_forcelist=(429, 500, 502, 503, 504))
session.mount("https://", HTTPAdapter(max_retries=retries))

print("Downloading {}".format(SetsURL))
urllib.request.urlretrieve(SetsURL, SetsFile)
with open(SetsFile, "r", encoding="utf8") as file:
    MTGSets = json.load(file)["data"]
print("Done")

extra_headers = {}
extra_headers["Referer"] = "https://gatherer.wizards.com/"


def dl_set_icon(mtgset):
    for rarity in ["common", "uncommon", "rare", "mythic"]:
        s = mtgset["code"].upper()
        icon_url = f"https://gatherer-static.wizards.com/set_symbols/{s}/large-{rarity}-{s}.png"
        icon_path = IconsFolder + mtgset["code"] + "_" + rarity + ".png"

        if not os.path.exists(icon_path):
            print(f"\tDownloading {icon_url}... ", end="")
            try:
                resp = session.get(icon_url, stream=True, headers={}, timeout=10)
                if resp.status_code == 200:
                    data = b""
                    for chunk in resp.iter_content(8192):
                        if chunk:
                            data += chunk
                    if len(data) == 13098:
                        print("Rate limited? Waiting...")
                        time.sleep(10)
                        resp = session.get(icon_url, stream=True, headers={}, timeout=10)
                        if resp.status_code != 200:
                            print(f"Error: {resp.status_code}")
                            return
                        data = b""
                        for chunk in resp.iter_content(8192):
                            if chunk:
                                data += chunk
                        if len(data) == 13098:
                            print(f"Still rate limited? Giving up.")
                            return

                    print("Ok.")
                    with open(icon_path, "wb") as fh:
                        fh.write(data)
                    try:
                        print("\t\tTriming...", end="")
                        im = Image.open(icon_path)
                        im.crop(im.getbbox()).save(icon_path)
                        print("Ok.")
                    except Exception as e:
                        print(f"Error: {e}")
                else:
                    print(f"Error: {resp.status_code}")
                    if resp.status_code == 403:
                        # Assume the other ones won't work either.
                        return
            except Exception as e:
                print(f"Error: {e}")


for mtgset in MTGSets:
    dl_set_icon(mtgset)

SetsWithIcons = set()
for icon in os.listdir(IconsFolder):
    set_code = icon[0 : icon.index("_")]
    SetsWithIcons.add(set_code)
with open("./client/src/assets/data/sets_with_icons.json", "w", encoding="utf8") as outfile:
    json.dump(list(SetsWithIcons), outfile)
