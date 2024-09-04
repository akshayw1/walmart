import requests
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.common.actions.wheel_input import ScrollOrigin
from selenium import webdriver
import time
import json

with open("coco128.yaml", "r") as f:
    config = f.read()

objects = []

temp = config.split('\n')[7:87]

for obj in temp:
    objects.append(obj.split(': ')[1])
link_template = "https://www.amazon.com/s?k="

obj_link_mapping = {}

browser = webdriver.Chrome()
for obj in objects:
    link = link_template+"+".join(obj.split(" "))

    try:
        browser.get(str(link))
        time.sleep(1)
        a = browser.find_elements(
            By.CSS_SELECTOR, ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal")
        b = browser.find_elements(
            By.CSS_SELECTOR, ".s-image.s-image-optimized-rendering")

        # print(a[0].get_attribute('href'))
        obj_link_mapping[obj] = {
            "url": [a[0].get_attribute('href'), a[1].get_attribute('href'), a[2].get_attribute('href')],
            "images": [b[0].get_attribute('src'), b[1].get_attribute('src'), b[2].get_attribute('src')]}
    except:
        print(obj)

with open("obj_link_mapping.json", "w") as f:
    json.dump(obj_link_mapping, f)
