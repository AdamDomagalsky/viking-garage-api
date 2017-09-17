process.env.NODE_ENV = 'test';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import server from '../../server';
const should = chai.should();
chai.use(chaiHttp);

describe('user/signup tests', () => {
  it('should return error due the one empty field (birthday)', (done) => {
    chai.request(server)
      .post('/user/signup')
      .send({
        firstname: 'Viking',
        lastname: 'Garage',
        email: 'viking.garage.app@gmail.com',
        password1: 'secret',
        password2: 'secret',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('err');
        res.body.err.should.be.equal('Please fill in all the fields.');
        done();
      });
  });

  it('should return error because of user with the same email in database', (done) => {
    chai.request(server)
      .post('/user/signup')
      .send({
        firstname: 'Viking',
        lastname: 'Garage',
        email: 'viking.garage.app@gmail.com',
        birthday: new Date(),
        password1: 'secret',
        password2: 'secret',
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.have.property('err');
        res.body.err.should.be.equal('There was an error processing your request');
        done();
      });
  });

  xit('should create new user successfully', (done) => {
    chai.request(server)
      .post('/user/signup')
      .send({
        firstname: 'Viking',
        lastname: 'Garage',
        email: 'viking.garage.app+12@gmail.com',
        birthday: new Date(),
        password1: 'secret',
        password2: 'secret',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.not.have.property('err');
        res.body.should.have.property('msg');
        res.body.msg.should.be.equal('User created successfully - email sent');
        done();
      });
  });
});