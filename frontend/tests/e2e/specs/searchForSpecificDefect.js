module.exports = {
    'Search for specific defect in admin page': function (browser) {
        browser
            .url('http://localhost:8080/admin')
            .waitForElementVisible('body')
            .assert.elementPresent("#searchDefect")
            .setValue("#searchDefect", "Beamer kapot")
            .assert.containsText(".defects table td", "Beamer kapot")
            .end()
    }
}