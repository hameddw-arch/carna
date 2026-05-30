import sys
from playwright.sync_api import sync_playwright

def test_site():
    with sync_playwright() as p:
        print("Launching Chromium...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            record_video_dir="scratch/videos/"
        )
        page = context.new_page()

        print("Navigating to https://carna.online...")
        page.goto('https://carna.online')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='scratch/home_page.png')
        print("Home page loaded. Screenshot saved.")

        print("Navigating to Login page...")
        page.goto('https://carna.online/login')
        page.wait_for_load_state('networkidle')
        
        print("Filling login details...")
        page.fill('input[type="tel"]', '0911223344')
        page.check('input[type="checkbox"]')
        page.click('button.btn-primary')
        
        print("Waiting for OTP code to appear...")
        # Wait for the OTP input to appear
        page.wait_for_selector('input[placeholder="000000"]')
        # Extract the 6-digit code via JS
        otp_code = page.evaluate("""() => {
            const divs = Array.from(document.querySelectorAll('div'));
            const codeDiv = divs.find(d => d.innerText && d.innerText.match(/^\\d{6}$/));
            return codeDiv ? codeDiv.innerText.trim() : null;
        }""")
        print(f"Retrieved OTP: {otp_code}")
        
        print("Submitting OTP...")
        # The input is the one with placeholder "000000"
        page.fill('input[placeholder="000000"]', otp_code)
        page.click('button.btn-primary')
        
        print("Waiting for navigation after login...")
        page.wait_for_url('https://carna.online/', timeout=10000)
        page.wait_for_load_state('networkidle')
        
        print("Navigating to Add Ad page...")
        page.goto('https://carna.online/post-ad')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='scratch/add_ad_page.png')
        print("Add Ad page loaded. Screenshot saved.")
        
        print("Navigating to User Dashboard...")
        page.goto('https://carna.online/user/dashboard')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='scratch/user_dashboard.png')
        print("User Dashboard loaded. Screenshot saved.")

        browser.close()
        print("Test completed successfully!")

if __name__ == '__main__':
    test_site()
