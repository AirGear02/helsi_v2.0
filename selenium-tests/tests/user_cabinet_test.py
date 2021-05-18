from selenium.webdriver.remote.webdriver import WebDriver

from utils import wait_element, wait_url_changed

PAGE_URL = 'http://localhost:3000/cabinet'

USER_MENU_DROP_DOWN_SELECTOR = '#user-menu-btn > button'
OPEN_CABINET_MENU_ITEM_SELECTOR = 'ul[role="menu"]:first-child'
APPOINTMENT_ITEM_SELECTOR = '.makeStyles-list-72 > li'

DEFAULT_TIMEOUT = 2


class UserCabinetTest:
    def __init__(self, driver: WebDriver):
        self.driver = driver

    def open_user_cabinet(self) -> object:
        dropdown = self.driver.find_element_by_css_selector(USER_MENU_DROP_DOWN_SELECTOR)
        dropdown.click()
        wait_element(self.driver, OPEN_CABINET_MENU_ITEM_SELECTOR, DEFAULT_TIMEOUT)
        menu_item = self.driver.find_element_by_css_selector(OPEN_CABINET_MENU_ITEM_SELECTOR)
        menu_item.click()
        return UserCabinetTest(self.driver)

    def is_page_opened(self) -> bool:
        wait_url_changed(self.driver, PAGE_URL, DEFAULT_TIMEOUT)
        return self.driver.current_url == PAGE_URL

    def has_appointments(self):
        wait_element(self.driver, APPOINTMENT_ITEM_SELECTOR, DEFAULT_TIMEOUT)
        appointments = self.driver.find_elements_by_css_selector(APPOINTMENT_ITEM_SELECTOR)
        return len(appointments) > 0
