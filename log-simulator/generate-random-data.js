'use strict';

module.exports = {
    generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
    // generate data with Faker:
    const id = Faker.random.uuid();
    const no = Faker.random.number({ 'min': 0, 'max': 500 });

    // add variables to virtual user's context:
    userContext.vars.id = id;
    userContext.vars.no = no;
    // continue with executing the scenario:
    return done();
}
