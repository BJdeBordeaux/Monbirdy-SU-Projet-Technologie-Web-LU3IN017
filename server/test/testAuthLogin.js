const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../index.js'); // c'est l'app "express"
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API Auth", () => {
    mocha.it("authLogin", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            username: "test",
            password: "123456",
        };

        // Register existing user and email
        request
            .post('/api/auth/login')
            .send(user)
            .then((res) => {
                res.should.have.status(200);
                console.log(`log in for user ${user.username}`)
            })
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
});