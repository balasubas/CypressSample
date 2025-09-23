# Cypress Sample Test Suite

A comprehensive end-to-end test suite built with Cypress for testing the SauceDemo e-commerce application.

## 🎯 Test Target

This test suite runs against **[SauceDemo](https://www.saucedemo.com/)** - a sample e-commerce application designed for testing purposes.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Test Coverage](#test-coverage)
- [Custom Commands](#custom-commands)
- [Test Data](#test-data)
- [Configuration](#configuration)
- [Contributing](#contributing)

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/balasubas/CypressSample.git
   cd CypressSample
   ```

2. **Install dependencies**
   ```bash
   npm install --save-dev
   ```

## 🚀 Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
# Open Cypress Test Runner
npx cypress open

# Open with specific browser (Firefox)
npx cypress open --browser firefox

# Using the provided script (Linux/Mac)
./run_test.sh
```

### Headless Mode
```bash
# Run all tests headlessly
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/core/regular_user_test.cy.js"

# Run with specific browser
npx cypress run --browser chrome
```

## 📁 Test Structure

```
cypress/
├── e2e/
│   └── core/
│       ├── page_access.cy.js          # Basic page access tests
│       ├── regular_user_test.cy.js    # Comprehensive user journey tests
│       └── problem_user_test.cy.js    # Problem user scenario tests
├── fixtures/
│   ├── lists/
│   │   └── shopping_list.json         # Test data for shopping scenarios
│   ├── messages/
│   │   └── std_messages.json          # Expected UI messages
│   └── users/                         # User credentials for different user types
├── support/
│   ├── commands.js                    # Cypress commands (empty)
│   ├── e2e.js                        # Global test configuration
│   ├── access.js                     # Login/logout custom commands
│   └── item_commands.js              # Shopping cart custom commands
```

## 🧪 Test Coverage

### Current Test Suites

#### 1. **Page Access Tests** (`page_access.cy.js`)
- Basic login functionality
- Page accessibility validation

#### 2. **Regular User Tests** (`regular_user_test.cy.js`)
- **Core Shopping Flow:**
  - Budget-based item selection
  - Add/remove items from cart
  - Complete checkout process

- **Additional Test Scenarios (14+ tests):**
  - Product display validation
  - Product detail page navigation
  - Cart badge updates
  - Cart persistence across navigation
  - Product sorting (A-Z, Z-A, price high-low, low-high)
  - Form validation (checkout fields)
  - Checkout calculations (subtotal, tax, total)
  - Cancel checkout functionality
  - Burger menu functionality
  - App state reset functionality
  - Product image validation
  - Footer information validation

#### 3. **Problem User Tests** (`problem_user_test.cy.js`)
- Tests for users with specific behavioral issues
- Edge case scenario validation

### Test Metrics
- **Total Test Files:** 3
- **Individual Test Cases:** 20+
- **User Types Covered:** Standard, Problem, Locked, Visual, Glitch
- **Test Categories:** Authentication, Shopping Flow, UI Validation, Form Validation

## 🛠️ Custom Commands

### Authentication Commands (`access.js`)
- `cy.logIn(userType)` - Login with different user types
- `cy.logOut()` - Logout and return to login page
- `cy.enterUsername(username)` - Enter username
- `cy.enterPassword(password)` - Enter password
- `cy.clickLogin()` - Click login button

### Shopping Commands (`item_commands.js`)
- `cy.find_item(itemName)` - Find product by name
- `cy.navigate_to_cart()` - Navigate to shopping cart
- `cy.find_cart_item(name)` - Find item in cart
- `cy.checkout(first, last, zip)` - Complete checkout process

### User Types Available
- `STANDARD` - Regular user (default)
- `PROBLEM` - User with performance issues
- `LOCKED` - Locked out user
- `VISUAL` - User with visual issues
- `GLITCH` - User with glitched behavior

## 📊 Test Data

### Shopping Lists (`shopping_list.json`)
- Standard shopping list with budget constraints
- Problem user scenarios
- Checkout user information
- Items for removal testing

### Expected Messages (`std_messages.json`)
- Login error messages
- Checkout completion messages
- Form validation messages

## ⚙️ Configuration

### Cypress Configuration (`cypress.config.js`)
- **Base URL:** https://www.saucedemo.com/
- **Viewport:** 1000x600
- **Test Isolation:** Disabled for performance
- **Timeouts:** Configured for reliable testing
- **Retries:** 2 attempts in run mode

### Key Settings
```javascript
{
  baseUrl: 'https://www.saucedemo.com/',
  testIsolation: false,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 180000,
  viewportWidth: 1000,
  viewportHeight: 600,
  retries: { runMode: 2, openMode: 0 }
}
```

## 🎯 Test Scenarios Covered

### E-commerce Functionality
- ✅ User authentication (multiple user types)
- ✅ Product catalog browsing
- ✅ Product detail viewing
- ✅ Shopping cart management
- ✅ Product sorting and filtering
- ✅ Checkout process (form validation, calculations)
- ✅ Order completion

### UI/UX Validation
- ✅ Product image display
- ✅ Navigation menu functionality
- ✅ Cart badge updates
- ✅ Form field validation
- ✅ Error message display
- ✅ Footer information
- ✅ Responsive behavior

### Edge Cases
- ✅ Empty cart scenarios
- ✅ Budget constraint testing
- ✅ Item removal and re-addition
- ✅ Navigation state persistence
- ✅ App state reset functionality

### Test Writing Guidelines
- Follow the existing naming conventions
- Use custom commands for reusable actions
- Add appropriate fixtures for test data
- Include both positive and negative test cases
- Ensure tests are independent and can run in any order

## 📝 License

This project is licensed under the ISC License.

## 🔗 Links

- [Cypress Documentation](https://docs.cypress.io/)
- [SauceDemo Application](https://www.saucedemo.com/)
- [Project Repository](https://github.com/balasubas/CypressSample)

---

**Last Updated:** September 2025
**Cypress Version:** 15.1.0
**Test Status:** ✅ All tests passing