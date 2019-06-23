/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const moment = require('moment')l
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
      delete_password: req.body.delete_password;
    });
    
  })
  .put(function(req, res){
    const board = req.params.board;
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
