module.exports = {
    'reset filters in admin page': function (browser) {
        browser
            .url('http://localhost:8080/admin')
            .click('.btn-filter')
            .click('#flex-filter-category .v-select__slot')
            .click('.v-menu__content:nth-child(3)>div>div')
            // .pause(1000)
            .click('#flex-filter-campus .v-select__slot')
            .click('.v-menu__content:nth-child(4)>div>div')
            // .pause(1000)
            .click('#flex-filter-classroom .v-select__slot')
            .click('.v-menu__content:nth-child(5)>div>div')
            // .pause(1000)
            .click('#flex-filter-priority .v-select__slot')
            .click('.v-menu__content:nth-child(6)>div>div')
            // .pause(1000)
            .click('#flex-filter-status .v-select__slot')
            .click('.v-menu__content:nth-child(7)>div>div')
            // .pause(1000)

            .assert.containsText("#flex-filter-category .v-select__selection", "Elektriciteit")
            .assert.containsText("#flex-filter-campus .v-select__selection", "Ellermanstraat")
            .assert.containsText("#flex-filter-classroom .v-select__selection", "02.05")
            .assert.containsText("#flex-filter-priority .v-select__selection", "HIGH")
            .assert.containsText("#flex-filter-status .v-select__selection", "Open")
    }
}