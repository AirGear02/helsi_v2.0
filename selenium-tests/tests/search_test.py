from selenium.webdriver.remote.webdriver import WebDriver

from utils import wait_element, button_click, wait_url_changed

PAGE_URL = 'http://localhost:3000/'

SEARCH_FIELD_SELECTOR = '.makeStyles-inputInput-29'
SEARCH_BUTTON_SELECTOR = '.makeStyles-button-16'
DOCTOR_CARD_SELECTOR = '.makeStyles-card-46'
DOCTOR_TITLE_SELECTOR = '.makeStyles-title-49'
DOCTOR_INFO_BUTTON_SELECTOR = '.makeStyles-button-48'

DEFAULT_TIMEOUT = 2


class SearchTest:
    def __init__(self, driver: WebDriver):
        self.driver = driver

    def search_doctor(self, name: str) -> object:
        search_field = self.driver.find_element_by_css_selector(SEARCH_FIELD_SELECTOR)
        search_field.clear()
        search_field.send_keys(name)
        button_click(self.driver, SEARCH_BUTTON_SELECTOR, DEFAULT_TIMEOUT)
        return SearchTest(self.driver)

    def are_doctors_found(self) -> bool:
        wait_element(self.driver, DOCTOR_CARD_SELECTOR, DEFAULT_TIMEOUT)
        doctor_cards = self.driver.find_elements_by_css_selector(DOCTOR_CARD_SELECTOR)
        return len(doctor_cards) > 0

    def validate_doctors_name(self, name: str):
        wait_element(self.driver, DOCTOR_TITLE_SELECTOR, DEFAULT_TIMEOUT)
        doctor_names = self.driver.find_elements_by_css_selector(DOCTOR_TITLE_SELECTOR)
        for title in doctor_names:
            if name not in title.text.lower():
                return False

        return True

    def open_appointments_page(self):

        wait_element(self.driver, DOCTOR_INFO_BUTTON_SELECTOR, DEFAULT_TIMEOUT)
        button = self.driver.find_element_by_css_selector(DOCTOR_INFO_BUTTON_SELECTOR)
        button.click()
        wait_url_changed(self.driver, PAGE_URL, 10)
