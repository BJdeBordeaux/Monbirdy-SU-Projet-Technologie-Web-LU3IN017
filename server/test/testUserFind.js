const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../index.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API users", () => {
    mocha.it("userFind", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            username: "test",
            password: "123456",
        };
        
        request
            .post('/api/auth/login')
            .send(user)
            .then((res) => {
                res.should.have.status(200);
                request
                    .get(`/api/users?username=${res.body.username}`)
                    .then((res) => {
                        res.should.have.status(200);
                        console.log(`find user : ${res.body.username}`)
                    })
                
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
})

