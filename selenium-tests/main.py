from selenium import webdriver
from tests.auth_test import AuthTest
from tests.search_test import SearchTest
from tests.appointments_page import AppointmentTest
from tests.user_cabinet_test import UserCabinetTest

BASE_URL = 'http://localhost:3000/'

TEST_USER_EMAIL = 'user@mail.com'
TEST_USER_PASSWORD = 'user1234'
EXISTING_DOCTOR_NAME = 'герасимчук'

INVALID_USER_EMAIL = 'user@mail.com'
INVALID_USER_PASSWORD = 'invalid_password'
NOT_EXISTING_DOCTOR_NAME = 'kek'

TESTS_NAMES = {
    1: 'Failure login',
    2: 'Success login',
    3: 'Not found doctors',
    4: 'Found doctors',
    5: 'Check doctors name',
    6: 'Open appointments page',
    7: 'Choose free time slot',
    8: 'Book appointment',
    9: 'Open cabinet page',
    10: 'At least 1 appointment exists'

}

current_test = 1


def print_test(is_passed: bool = True):
    global current_test
    print(f'TEST#{current_test:<5}{TESTS_NAMES[current_test]:40}{"PASSED" if is_passed else "FAILED"}')
    current_test += 1


def get_web_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors')
    options.add_argument("window-size=1400,800")
    return webdriver.Chrome(options=options)


def run_tests():
    driver = get_web_driver()
    driver.get(BASE_URL)
    # ----------------------------------------
    # login tests
    login_page = AuthTest(driver)
    login_page.open_login_popup()

    login_page.login_as(INVALID_USER_EMAIL, INVALID_USER_PASSWORD)
    assert login_page.is_login_failure()
    print_test()

    login_page.login_as(TEST_USER_EMAIL, TEST_USER_PASSWORD)
    assert login_page.is_login_success()
    print_test()

    # ----------------------------------------
    # search doctor tests
    search_page = SearchTest(driver)

    search_page.search_doctor(NOT_EXISTING_DOCTOR_NAME)
    assert not search_page.are_doctors_found()
    print_test()

    search_page.search_doctor(EXISTING_DOCTOR_NAME)
    assert search_page.are_doctors_found()
    print_test()

    assert search_page.validate_doctors_name(EXISTING_DOCTOR_NAME)
    print_test()

    search_page.open_appointments_page()
    # ----------------------------------------
    # search doctor tests
    appointment_test = AppointmentTest(driver)

    assert appointment_test.is_appointment_page_opened()
    print_test()

    appointment_test.choose_free_timeslot()
    assert appointment_test.is_free_slot_chosen()
    print_test()

    appointment_test.make_appointment()
    assert appointment_test.check_if_appointment_success()
    print_test()

    # ----------------------------------------
    # user cabinet test
    user_cabinet_test = UserCabinetTest(driver)
    user_cabinet_test.open_user_cabinet()

    assert user_cabinet_test.is_page_opened()
    print_test()

    assert user_cabinet_test.has_appointments()
    print_test()

    print('All tests were passed successfully')


if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print_test(False)
