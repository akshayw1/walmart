from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.common.actions.wheel_input import ScrollOrigin
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import json

# Read configuration file
with open("coco128.yaml", "r") as f:
    config = f.read()

objects = []

# Extract objects from configuration file
temp = config.split('\n')[7:87]
for obj in temp:
    objects.append(obj.split(': ')[1])

# Define link template
link_template = "https://www.walmart.com/search?q="

# Initialize dictionary to store object link mappings
obj_link_mapping = {}

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36')

# Initialize WebDriver with Chrome options
# Iterate through objects to get links and images
for obj in objects:

    browser = webdriver.Chrome(options=chrome_options)

    # # Open a new window 
    browser.execute_script("window.open('');")
    browser.switch_to.window(browser.window_handles[1])

    link = link_template + "+".join(obj.split(" "))

    try:
        browser.get(link)
        time.sleep(1)
        a = browser.find_element(By.CSS_SELECTOR, ".h-100.pr4-xl.pb1-xl.pv1.ph1")
        print(a.find_element(By.TAG_NAME, 'img').get_attribute('src'))
        # Extract image URL and page URL
        obj_link_mapping[obj] = {
            "url": a.find_element(By.TAG_NAME, 'img').get_attribute('src'),
            "images": a.find_element(By.TAG_NAME, 'a').get_attribute('href')
        }
    except Exception as e:
        print(f"Error with object '{obj}': {e}")

# Save the object link mappings to a JSON file
with open("obj_link_mapping.json", "w") as f:
    json.dump(obj_link_mapping, f)

# Close the browser
browser.quit()
