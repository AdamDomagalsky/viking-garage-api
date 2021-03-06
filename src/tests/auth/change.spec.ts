import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { v1 } from 'uuid';
import server from '../../server';
import db from '../../sequelize';
const should = chai.should();
chai.use(chaiHttp);

describe('user/change tests', () => {
  it('should return error because of token expired', (done) => {
    chai.request(server)
      .post('/user/change')
      .send({
        password1: 'secret',
        password2: 'secret',
        token: v1(),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('err');
        res.body.err.should.equal(true);
        res.body.should.have.property('msg');
        res.body.msg.should.be.equal('Your reset token has expired, please reset the password again');
        done();
      });
  }).timeout(10946);

  it('should changed password successfully', (done) => {
    const email = 'viking.garage.app@gmail.com';
    db['account'].findOne({ where: { email } })
    .then((account) => {
      chai.request(server)
        .post('/user/change')
        .send({
          password1: 'new_pass',
          password2: 'new_pass',
          token: account.token,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('err');
          res.body.err.should.equal(false);
          res.body.should.have.property('msg');
          res.body.msg.should.be.equal('Password changed successfully');
          done();
        });
    });
  });
});
