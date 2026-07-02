#!/usr/bin/env python3
"""
Backend API Tests for Kenia Navarro Dance Website
Tests contact form and newsletter endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Read BASE_URL from .env
def get_base_url():
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_BASE_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading .env: {e}")
        return None

BASE_URL = get_base_url()
if not BASE_URL:
    print("ERROR: Could not read NEXT_PUBLIC_BASE_URL from .env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"Testing API at: {API_URL}\n")

# Test results tracking
tests_passed = 0
tests_failed = 0
test_results = []

def log_test(test_name, passed, details=""):
    global tests_passed, tests_failed
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {test_name}")
    if details:
        print(f"   {details}")
    print()
    
    if passed:
        tests_passed += 1
    else:
        tests_failed += 1
    
    test_results.append({
        "test": test_name,
        "passed": passed,
        "details": details
    })

def is_valid_uuid(uuid_string):
    """Check if string is a valid UUID"""
    import re
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
    return bool(uuid_pattern.match(str(uuid_string)))

print("="*80)
print("BACKEND API TESTS - KENIA NAVARRO DANCE WEBSITE")
print("="*80)
print()

# ============================================================================
# TEST 1: POST /api/contact - Success Case
# ============================================================================
print("TEST 1: POST /api/contact - Success with valid data")
try:
    payload = {
        "name": "Sofia Martinez",
        "email": "sofia.martinez@example.com",
        "message": "I'm interested in learning more about the Continuum movement practice and upcoming workshops.",
        "locale": "en"
    }
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check response structure
        checks = []
        checks.append(("success field is true", data.get('success') == True))
        checks.append(("message field exists", 'message' in data))
        
        if 'message' in data:
            msg = data['message']
            checks.append(("id is valid UUID", is_valid_uuid(msg.get('id'))))
            checks.append(("name matches", msg.get('name') == payload['name']))
            checks.append(("email matches", msg.get('email') == payload['email']))
            checks.append(("message matches", msg.get('message') == payload['message']))
            checks.append(("locale matches", msg.get('locale') == payload['locale']))
            checks.append(("createdAt exists", 'createdAt' in msg))
            checks.append(("no _id field (Mongo leak)", '_id' not in msg))
        
        all_passed = all(check[1] for check in checks)
        details = "; ".join([f"{check[0]}: {check[1]}" for check in checks])
        log_test("POST /api/contact - Success", all_passed, details)
        
        # Store for later verification
        contact_id = data.get('message', {}).get('id')
    else:
        log_test("POST /api/contact - Success", False, f"Expected 200, got {response.status_code}: {response.text}")
        
except Exception as e:
    log_test("POST /api/contact - Success", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2: POST /api/contact - Missing name
# ============================================================================
print("TEST 2: POST /api/contact - Validation: missing name")
try:
    payload = {
        "email": "test@example.com",
        "message": "This should fail",
        "locale": "en"
    }
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    if response.status_code == 400:
        data = response.json()
        has_error = 'error' in data
        log_test("POST /api/contact - Missing name returns 400", True, f"Error message: {data.get('error', 'N/A')}")
    else:
        log_test("POST /api/contact - Missing name returns 400", False, f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/contact - Missing name returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 3: POST /api/contact - Missing message
# ============================================================================
print("TEST 3: POST /api/contact - Validation: missing message")
try:
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "locale": "en"
    }
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    if response.status_code == 400:
        data = response.json()
        log_test("POST /api/contact - Missing message returns 400", True, f"Error message: {data.get('error', 'N/A')}")
    else:
        log_test("POST /api/contact - Missing message returns 400", False, f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/contact - Missing message returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 4: POST /api/contact - Invalid email
# ============================================================================
print("TEST 4: POST /api/contact - Validation: invalid email")
try:
    payload = {
        "name": "Test User",
        "email": "notanemail",
        "message": "This should fail",
        "locale": "en"
    }
    
    response = requests.post(f"{API_URL}/contact", json=payload, timeout=10)
    
    if response.status_code == 400:
        data = response.json()
        log_test("POST /api/contact - Invalid email returns 400", True, f"Error message: {data.get('error', 'N/A')}")
    else:
        log_test("POST /api/contact - Invalid email returns 400", False, f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/contact - Invalid email returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 5: GET /api/contact - Retrieve messages
# ============================================================================
print("TEST 5: GET /api/contact - Retrieve stored messages")
try:
    response = requests.get(f"{API_URL}/contact", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        checks = []
        checks.append(("returns array", isinstance(data, list)))
        
        if isinstance(data, list) and len(data) > 0:
            # Check first message structure
            first_msg = data[0]
            checks.append(("no _id field in messages", '_id' not in first_msg))
            checks.append(("has id field", 'id' in first_msg))
            checks.append(("has createdAt field", 'createdAt' in first_msg))
            
            # Verify our posted message appears
            found_sofia = any(msg.get('email') == 'sofia.martinez@example.com' for msg in data)
            checks.append(("posted message appears in list", found_sofia))
        
        all_passed = all(check[1] for check in checks)
        details = "; ".join([f"{check[0]}: {check[1]}" for check in checks]) + f"; count: {len(data)}"
        log_test("GET /api/contact - Retrieve messages", all_passed, details)
    else:
        log_test("GET /api/contact - Retrieve messages", False, f"Expected 200, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/contact - Retrieve messages", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 6: POST /api/newsletter - New email
# ============================================================================
print("TEST 6: POST /api/newsletter - New email subscription")
try:
    # Use timestamp to ensure unique email
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    payload = {
        "email": f"dancer.{timestamp}@example.com",
        "locale": "es"
    }
    
    response = requests.post(f"{API_URL}/newsletter", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        checks = []
        checks.append(("success is true", data.get('success') == True))
        checks.append(("alreadySubscribed is false", data.get('alreadySubscribed') == False))
        
        all_passed = all(check[1] for check in checks)
        details = "; ".join([f"{check[0]}: {check[1]}" for check in checks])
        log_test("POST /api/newsletter - New email", all_passed, details)
        
        # Store email for duplicate test
        test_email = payload['email']
    else:
        log_test("POST /api/newsletter - New email", False, f"Expected 200, got {response.status_code}: {response.text}")
        test_email = None
        
except Exception as e:
    log_test("POST /api/newsletter - New email", False, f"Exception: {str(e)}")
    test_email = None

# ============================================================================
# TEST 7: POST /api/newsletter - Duplicate email (dedupe)
# ============================================================================
print("TEST 7: POST /api/newsletter - Duplicate email (dedupe check)")
try:
    if test_email:
        payload = {
            "email": test_email,
            "locale": "en"
        }
        
        response = requests.post(f"{API_URL}/newsletter", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            checks = []
            checks.append(("success is true", data.get('success') == True))
            checks.append(("alreadySubscribed is true", data.get('alreadySubscribed') == True))
            
            all_passed = all(check[1] for check in checks)
            details = "; ".join([f"{check[0]}: {check[1]}" for check in checks])
            log_test("POST /api/newsletter - Duplicate dedupe", all_passed, details)
        else:
            log_test("POST /api/newsletter - Duplicate dedupe", False, f"Expected 200, got {response.status_code}")
    else:
        log_test("POST /api/newsletter - Duplicate dedupe", False, "Skipped: no test email from previous test")
        
except Exception as e:
    log_test("POST /api/newsletter - Duplicate dedupe", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 8: POST /api/newsletter - Invalid email
# ============================================================================
print("TEST 8: POST /api/newsletter - Validation: invalid email")
try:
    payload = {
        "email": "notanemail",
        "locale": "en"
    }
    
    response = requests.post(f"{API_URL}/newsletter", json=payload, timeout=10)
    
    if response.status_code == 400:
        data = response.json()
        log_test("POST /api/newsletter - Invalid email returns 400", True, f"Error message: {data.get('error', 'N/A')}")
    else:
        log_test("POST /api/newsletter - Invalid email returns 400", False, f"Expected 400, got {response.status_code}")
        
except Exception as e:
    log_test("POST /api/newsletter - Invalid email returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 9: GET /api/newsletter - Retrieve subscriptions
# ============================================================================
print("TEST 9: GET /api/newsletter - Retrieve subscriptions")
try:
    response = requests.get(f"{API_URL}/newsletter", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        checks = []
        checks.append(("returns array", isinstance(data, list)))
        
        if isinstance(data, list) and len(data) > 0:
            # Check first subscription structure
            first_sub = data[0]
            checks.append(("no _id field in subscriptions", '_id' not in first_sub))
            checks.append(("has id field", 'id' in first_sub))
            checks.append(("has email field", 'email' in first_sub))
            checks.append(("has createdAt field", 'createdAt' in first_sub))
        
        all_passed = all(check[1] for check in checks)
        details = "; ".join([f"{check[0]}: {check[1]}" for check in checks]) + f"; count: {len(data)}"
        log_test("GET /api/newsletter - Retrieve subscriptions", all_passed, details)
    else:
        log_test("GET /api/newsletter - Retrieve subscriptions", False, f"Expected 200, got {response.status_code}")
        
except Exception as e:
    log_test("GET /api/newsletter - Retrieve subscriptions", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("="*80)
print("TEST SUMMARY")
print("="*80)
print(f"Total Tests: {tests_passed + tests_failed}")
print(f"Passed: {tests_passed}")
print(f"Failed: {tests_failed}")
print()

if tests_failed == 0:
    print("✅ ALL TESTS PASSED")
    sys.exit(0)
else:
    print("❌ SOME TESTS FAILED")
    print("\nFailed tests:")
    for result in test_results:
        if not result['passed']:
            print(f"  - {result['test']}")
            if result['details']:
                print(f"    {result['details']}")
    sys.exit(1)
