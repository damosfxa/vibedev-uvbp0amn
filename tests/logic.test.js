const outputEl = document.getElementById('testOutput');

function logResult(msg, passed) {
    const p = document.createElement('p');
    p.className = passed ? 'pass' : 'fail';
    p.textContent = (passed ? '✅ PASS: ' : '❌ FAIL: ') + msg;
    outputEl.appendChild(p);
}

function assertEqual(actual, expected, testName) {
    if (actual === expected) {
        logResult(testName, true);
    } else {
        logResult(`${testName} (Expected: ${expected}, Got: ${actual})`, false);
    }
}

function runTests() {
    const logic = window.LaundryLogic;

    // Test 1: Add Item
    const res1 = logic.addItem("Test Shirt", "whites");
    assertEqual(res1.ok, true, "Should successfully add a valid item");

    // Test 2: Deduplication
    const res2 = logic.addItem("Test Shirt", "whites");
    assertEqual(res2.ok, false, "Should block duplicate item in the same category");

    // Test 3: Max Length
    const longName = "a".repeat(51);
    const res3 = logic.addItem(longName, "lights");
    assertEqual(res3.ok, false, "Should enforce MAX_NAME_LENGTH = 50");

    // Test 4: XSS Sanitization
    const res4 = logic.addItem("<script>alert(1)</script> Hacked", "darks");
    assertEqual(res4.ok, true, "Should allow sanitized input");
    assertEqual(res4.item.name, "alert(1) Hacked", "Should sanitize HTML tags properly");

    // Test 5: Ready State Math
    logic.addItem("Test Shirt 2", "whites");
    logic.addItem("Test Shirt 3", "whites"); // Now we have 3 whites
    const state = logic.getState();
    assertEqual(state.totalReadyLoads, 1, "Should correctly calculate 1 ready load when items >= 3");
}

runTests();
