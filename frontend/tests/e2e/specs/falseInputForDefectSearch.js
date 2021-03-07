module.exports = {
    'False input for defect search': function (browser) {
        browser
            .url('http://localhost:8080/admin')
            .waitForElementVisible('body')
            .assert.elementPresent("#searchDefect")
            .setValue("#searchDefect", "lorem ipsum")
            .assert.containsText(".defects table td", "No matching records found")
            .end()
    }
}