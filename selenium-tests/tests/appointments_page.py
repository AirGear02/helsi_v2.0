from selenium.webdriver.remote.webdriver import WebDriver
from utils import wait_element, button_click
from re import match, compile

PAGE_URL = compile(r'http://localhost:3000/schedule/\d')
FREE_SLOT_BUTTON_SELECTOR = '.slot_container > input'
SUCCESS_MESSAGE_SELECTOR = '.MuiAlert-filledSuccess'
MAKE_APPOINTMENT_BUTTON_SELECTOR = '.makeStyles-button-62'

DEFAULT_ELEMENT_TIMEOUT = 2


class AppointmentTest:
    def __init__(self, driver: WebDriver):
        self.driver = driver

    def is_appointment_page_opened(self) -> bool:
        return bool(match(PAGE_URL, self.driver.current_url))

    def choose_free_timeslot(self) -> object:
        wait_element(self.driver, FREE_SLOT_BUTTON_SELECTOR, DEFAULT_ELEMENT_TIMEOUT)
        free_slot = self.driver.find_element_by_css_selector(FREE_SLOT_BUTTON_SELECTOR)
        # click radio button
        self.driver.execute_script("arguments[0].click();", free_slot)
        return AppointmentTest(self.driver)

    def is_free_slot_chosen(self) -> bool:
        return wait_element(self.driver, MAKE_APPOINTMENT_BUTTON_SELECTOR, DEFAULT_ELEMENT_TIMEOUT)

    def make_appointment(self):
        button_click(self.driver, MAKE_APPOINTMENT_BUTTON_SELECTOR, DEFAULT_ELEMENT_TIMEOUT)

    def check_if_appointment_success(self):
        return wait_element(self.driver, SUCCESS_MESSAGE_SELECTOR, DEFAULT_ELEMENT_TIMEOUT)
