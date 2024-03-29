from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def wait_url_changed(driver: WebDriver, old_url: str, timeout: int) -> bool:
    try:
        WebDriverWait(driver, timeout).until(EC.url_changes(old_url))
    except Exception:
        return False
    return True


def wait_element(driver: WebDriver, element_selector: str, timeout: int) -> bool:
    try:
        WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, element_selector)))
    except Exception:
        return False
    return True


def button_click(driver: WebDriver, element_selector: str, timeout: int):
    wait_element(driver, element_selector, timeout=timeout)
    button = driver.find_element_by_css_selector(element_selector)
    button.click()


def wait_for_element_disappeared(driver: WebDriver, element_selector: str, timeout: int) -> bool:
    try:
        WebDriverWait(driver, timeout).until_not(EC.presence_of_element_located((By.CSS_SELECTOR, element_selector)))
    except Exception:
        return False
    return True


