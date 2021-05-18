from selenium.webdriver.remote.webdriver import WebDriver
from utils import wait_element, wait_for_element_disappeared, button_click

EMAIL_FIELD_SELECTOR = '#login-field'
PASSWORD_FIELD_SELECTOR = '#password-field'
LOGIN_BUTTON_SELECTOR = '#login-btn'
USER_MENU_BTN_SELECTOR = '#user-menu-btn'
SUBMIT_BUTTON_SELECTOR = '#submit-btn'
ERROR_SELECTOR = '.MuiAlert-message'

DEFAULT_TIMEOUT = 2


class AuthTest:
    def __init__(self, driver: WebDriver):
        self.driver = driver

    def open_login_popup(self):
        wait_element(self.driver, LOGIN_BUTTON_SELECTOR, timeout=DEFAULT_TIMEOUT)
        button_click(self.driver, LOGIN_BUTTON_SELECTOR, DEFAULT_TIMEOUT)
        return AuthTest(self.driver)

    def type_email(self, email):
        wait_element(self.driver, EMAIL_FIELD_SELECTOR, timeout=DEFAULT_TIMEOUT)
        email_field = self.driver.find_element_by_css_selector(EMAIL_FIELD_SELECTOR)

        email_field.clear()
        email_field.send_keys(email)
        return AuthTest(self.driver)

    def type_password(self, password):
        wait_element(self.driver, PASSWORD_FIELD_SELECTOR, timeout=DEFAULT_TIMEOUT)
        password_field = self.driver.find_element_by_css_selector(PASSWORD_FIELD_SELECTOR)

        password_field.clear()
        password_field.send_keys(password)
        return AuthTest(self.driver)

    def login_as(self, email, password):
        self.type_email(email)
        self.type_password(password)
        button_click(self.driver, SUBMIT_BUTTON_SELECTOR, DEFAULT_TIMEOUT)
        return AuthTest(self.driver)

    def is_login_success(self):
        return wait_for_element_disappeared(self.driver, LOGIN_BUTTON_SELECTOR,
                                            timeout=DEFAULT_TIMEOUT) and \
               wait_element(self.driver, USER_MENU_BTN_SELECTOR, timeout=DEFAULT_TIMEOUT)

    def is_login_failure(self):
        return len(self._get_form_errors()) > 0

    def _get_form_errors(self):
        wait_element(self.driver, ERROR_SELECTOR, timeout=DEFAULT_TIMEOUT)
        form_errors_elements = self.driver.find_elements_by_css_selector(ERROR_SELECTOR)
        return [x.text for x in form_errors_elements]
