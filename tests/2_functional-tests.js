/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('add thread to board: test', function(done){
        
        chai
        .request(server)
        .post('/api/threads/test')
        .send({ text: 'test', delete_password: 1234 })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
        
      });
      
    });
    
    suite('GET', function() {
      
      test('get all threads in test board', (done) => {
        chai
        .request(server)
        .get('/api/threads/test')
        .query()
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        })
      })
      
      
    });
    
    suite('DELETE', function() {
      
      test('delete threads with invalid password ', (done) => {
    
        chai
        .request(server)
        .delete('/api/threads/test')
        .send({ delete_password: '1111', thread_id: '5d0faf8badac8e4d07df8ee7'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });

      });
      
      test('delete threads with valid password ', (done) => {
    
        chai
        .request(server)
        .delete('/api/threads/test')
        .send({ delete_password: '1234', thread_id: '5d0faf8badac8e4d07df8ee7'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });

      })
      
    });
    
    suite('PUT', function() {
      test('reported thread', (done) => {
    
        chai
        .request(server)
        .put('/api/threads/test')
        .send({thread_id: '5d0fad76fe48ba47df2c1c05'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });

      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('post reply into thread', (done) => {
    
        chai
        .request(server)
        .post('/api/replies/test')
        .send({ thread_id: '5d0fa81e6050b81bfc24f12c', text: 'test', delete_password: '1234'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });

      })
      
    });
    
    suite('GET', function() {
      
      test('get reply in thread', (done) => {
        
        chai
        .request(server)
        .get('/api/replies/test')
        .query({ thread_id: '5d0fa81e6050b81bfc24f12c'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          done();
        });
        
      });
      
    });
    
    suite('PUT', function() {
      
      test('report reply in thread', (done) => {
        
        chai
        .request(server)
        .put('/api/replies/test')
        .send({ thread_id: '5d0fa81e6050b81bfc24f12c', reply_id: '5d0facbd94de9544b0999bf4'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
        
      });
      
    });
    
    suite('DELETE', function() {
      
      test('delete reply in thread with invalid password', (done) => {
        
        chai
        .request(server)
        .delete('/api/replies/test')
        .send({ thread_id: '5d0fa81e6050b81bfc24f12c', reply_id: '5d0facbd94de9544b0999bf4', delete_password: '1111'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
        
      });
      
      test('delete reply in thread with valid password', (done) => {
        
        chai
        .request(server)
        .delete('/api/replies/test')
        .send({ thread_id: '5d0fa81e6050b81bfc24f12c', reply_id: '5d0facbd94de9544b0999bf4', delete_password: '1234'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
        
      });
      
    });
    
  });

});
