module.exports = {
    'open filters in admin page': function (browser) {
      browser
        .url('http://localhost:8080')
        .waitForElementVisible('body')
        .assert.titleContains('frontend')
        .assert.visible('#drawerbutton')
        // .pause(4000)
        .click('#drawerbutton')
        .assert.visible('#nav-drawer')
        .assert.visible('#Admin')
        // .pause(4000)
        .click('#Admin')
        .url('http://localhost:8080/admin')
        .assert.visible('.admin')
        .assert.visible('.btn-filter')
        .assert.not.elementPresent('.filters')
        // .pause(4000)
        .click('.btn-filter')
        .assert.elementPresent('.filters')
        .end()
    }
  }