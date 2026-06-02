import requests
import json

base_url = "http://localhost:5173"
test_results = {}

# Test 1: HomePage
print("\n=== TEST 1: HomePage ===")
resp = requests.get(f"{base_url}/")
html = resp.text

has_dark_mode = 'dark:' in html
has_header = '<header' in html
has_about_link = 'about' in html.lower()

print(f"Status: {resp.status_code}")
print(f"Has dark mode classes: {has_dark_mode}")
print(f"Has header: {has_header}")
print(f"Has about page link: {has_about_link}")
test_results['HomePage'] = resp.status_code == 200 and has_dark_mode

# Test 2: AboutCARNAPage
print("\n=== TEST 2: AboutCARNAPage ===")
resp = requests.get(f"{base_url}/about")
html = resp.text

has_hero = 'hero' in html.lower() or 'h1' in html.lower()
has_icons = 'material-symbols' in html.lower()
has_animations = 'animation' in html.lower() or 'animate' in html.lower()

print(f"Status: {resp.status_code}")
print(f"Has hero/title: {has_hero}")
print(f"Has Material Symbols icons: {has_icons}")
print(f"Has animations: {has_animations}")
test_results['AboutPage'] = resp.status_code == 200 and has_icons

# Test 3: Dark mode script
print("\n=== TEST 3: Dark Mode Script ===")
resp = requests.get(f"{base_url}/")
html = resp.text

has_dark_toggle_script = 'documentElement.classList' in html
has_local_storage = 'localStorage' in html
has_theme_meta = 'theme-color' in html.lower()

print(f"Has dark mode toggle script: {has_dark_toggle_script}")
print(f"Has localStorage support: {has_local_storage}")
print(f"Has theme meta tag: {has_theme_meta}")
test_results['DarkModeScript'] = has_dark_toggle_script and has_local_storage

# Summary
print("\n" + "="*50)
print("VERIFICATION SUMMARY")
print("="*50)
for test, result in test_results.items():
    status = "[PASS]" if result else "[FAIL]"
    print(f"{status} {test}")

all_passed = all(test_results.values())
print("\n" + ("All tests PASSED!" if all_passed else "Some tests FAILED!"))
