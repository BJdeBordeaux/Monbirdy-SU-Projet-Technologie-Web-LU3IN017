const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../index.js'); // c'est l'app "express"
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API Auth", () => {
    mocha.it("authRegister2", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            username: "testtttt",
            email: "test@t.com",
            password: "123456",
        };

        // Register existing user and email
        request
            .post('/api/auth/register')
            .send(user)
            .then((res) => {
                res.should.have.status(400);
                console.log(`Register existing email \"${user.email}\"`);
            })
            
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
});