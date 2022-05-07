const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../index.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API users", () => {
    mocha.it("userFollow", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            username: "test",
            password: "123456",
        };
        const idToFollow = "625d9f427f9cc5c57f719c74";

        request
            .post('/api/auth/login')
            .send(user)
            .then((res) => {
                res.should.have.status(200);
                // return Promise.all([
                    request
                    .put(`/api/users/${res.body._id}/followings`)
                    .send({
                        userId: idToFollow
                    })
                    .then((res) => {
                        res.should.have.status(200);
                        console.log(`follow user : Junji : ${res.body}`)
                    });

                    request
                    .put(`/api/users/${res.body._id}/followings`)
                    .send({
                        userId: idToFollow
                    })
                    .then((res) => {
                        res.should.have.status(200);
                        console.log(`follow user : Junji : ${res.body}`)
                    });
                // ])


            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
})