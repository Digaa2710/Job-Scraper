import re
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def initialize_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    
    # Point to Chromium binary on Linux systems
    options.binary_location = "/usr/bin/chromium"

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def get_jobs(driver):
    driver.get("https://www.zeptojobs.in/mumbai")
    
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//section[starts-with(@id, "h.107")]'))
    )
    
    job_data = []
    job_sections = driver.find_elements(By.XPATH, '//section[starts-with(@id, "h.107")]')
    
    for section in job_sections:
        try:
            title_elem = section.find_element(By.XPATH, './/h1[contains(@class, "CDt4Ke")]')
            raw_title = title_elem.text.strip()
            
            cleaned_title = re.sub(r'(?i)\s*,?\s*mumbai\s*$', '', raw_title)
            paragraphs = section.find_elements(By.XPATH, './/p')
            link_elem = section.find_element(By.XPATH, './/a[contains(@class, "FKF6mc TpQm9d QmpIrf")]')
            
            location = salary = experience = openings = "N/A"
            
            for p in paragraphs:
                text = p.text.lower()
                if "location" in text:
                    location = p.text.replace("📍 location -", "").strip()
                elif "rs." in text:
                    salary = p.text.replace("💲", "").strip()
                elif "experience" in text:
                    experience = p.text.replace("🛅", "").strip()
                elif "openings" in text:
                    openings = p.text.replace("👷", "").strip()
            
            job_data.append({
                "title": cleaned_title,
                "location": location,
                "salary": salary,
                "experience": experience,
                "openings": openings,
                "link": link_elem.get_attribute("href")
            })
        
        except Exception as e:
            print(f"Error parsing section: {e}")
            continue
    
    return job_data

def job_find_main():
    driver = initialize_driver()
    try:
        job_listings = get_jobs(driver)
    finally:
        driver.quit()
    return job_listings