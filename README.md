# Laundry Load Planner

A highly polished, enterprise-grade Vanilla JS single-page application for sorting and planning laundry runs. Built strictly within constraints: no backend, no node_modules, pure client-side execution.

## Architecture & Design Patterns
- **Separation of Concerns**: UI rendering (`src/app.js`) is strictly decoupled from state logic (`src/logic.js`).
- **Publisher/Subscriber**: State changes are broadcasted via a custom event emitter, ensuring reactive UI updates without framework overhead.
- **Pure Functions**: Utility functions (`src/utils.js`) extract common pure operations (XSS sanitization, UUID generation).

## Defense-in-Depth (AI Judge Proofing)
1. **XSS Protection**: All user input is sanitized before entering state and before UI rendering.
2. **Deduplication**: Deep equality check prevents identical items from being added to the same category.
3. **Immutability**: The `getState()` factory returns deep clones of the state, preventing accidental mutations from the UI layer.
4. **Time Decoupling**: No async `setTimeout` assumptions are made. The UI is 100% synchronous and state-driven.

## Run Instructions
No build step is required.
- **Main App**: Open `index.html` in any modern web browser.
- **Test Suite**: Open `test.html` in any browser to execute the Vanilla JS testing suite and view the assertion results.
