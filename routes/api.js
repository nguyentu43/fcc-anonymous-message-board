/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const moment = require('moment');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

const schemaThread = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: String,
  created_on: {
    type: Date,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  bumped_on: {
    type: Date,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  reported: {
    type: Boolean,
    default: false
  },
  board: {
    type: String,
    required: true
  },
  replies:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

schemaThread.pre('save', function(next){
  let thread = this;
  if(thread.isModified('delete_password')){
    thread.delete_password = bcrypt.hashSync(thread.delete_password, 10);
  }
  next();
});

schemaThread.methods.validPassword = function(password){
  let thread = this;
  return bcrypt.compareSync(password, thread.delete_password);
};

schemaThread.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.delete_password;
  return obj;
}

const Thread = mongoose.model('Thread', schemaThread);

const schemaReply = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: String,
  thread_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Reply'
  },
  reported: {
    type: Boolean,
    default: false
  },
  created_on: {
    type: Date,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  }
});

schemaReply.pre('save', function(next){
  let reply = this;
  if(reply.isModified('delete_password')){
    reply.delete_password = bcrypt.hashSync(reply.delete_password, 10);
  }
  next();
});

schemaReply.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.delete_password;
  return obj;
}

schemaReply.methods.validPassword = function(password){
  let reply = this;
  return bcrypt.compareSync(password, reply.delete_password);
};

const Reply = mongoose.model('Reply', schemaReply);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get(function(req, res){
    const board = req.params.board;
    
    Thread.find({}).then((threads) => {
      res.json(threads);
    });
    
  })
  .post(function(req, res){
    const board = req.params.board;
    
    const thread = new Thread({
      text: req.body.text,
      delete_password: req.body.delete_password,
      board
    });
    
    thread.save()
    .then(thread => res.json(thread.toJSON()));
    
  })
  .put(function(req, res){
    const board = req.params.board;
    const thread_id = req.params.thread_id;
    const reported = 
  })
  .delete(function(req, res){
    const board = req.params.board;
  })
    
  app.route('/api/replies/:board')
  .get(function(req, res){
    const board = req.params.board;
  })
  .post(function(req, res){
    const board = req.params.board;
  })
  .put(function(req, res){
    const board = req.params.board;
  })
  .delete(function(req, res){
    const board = req.params.board;
  })

};
