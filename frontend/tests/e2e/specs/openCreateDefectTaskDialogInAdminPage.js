module.exports = {
    'open the create defect/task dialog in admin page': function (browser) {
        browser
            .url('http://localhost:8080/admin')
            .assert.not.elementPresent("#addDefectTaskCard")
            .click('#addDefectTaskButton')
            .pause(1000)
            .assert.elementPresent("#addDefectTaskCard")
            .assert.visible("#addDefectTaskCard")
    }
}