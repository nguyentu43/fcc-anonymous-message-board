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
  delete_password: {
    type: String,
    required: true
  },
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
}, { versionKey: false });

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
  obj.replycount = obj.replies.length;
  delete obj.delete_password;
  return obj;
}

const Thread = mongoose.model('Thread', schemaThread);

const schemaReply = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true
  },
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
}, { versionKey: false });

schemaReply.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.delete_password;
  return obj;
}

schemaReply.pre('save', function(next){
  let reply = this;
  if(reply.isModified('delete_password')){
    reply.delete_password = bcrypt.hashSync(reply.delete_password, 10);
  }
  next();
});

schemaReply.methods.validPassword = function(password){
  let reply = this;
  return bcrypt.compareSync(password, reply.delete_password);
};

const Reply = mongoose.model('Reply', schemaReply);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get(function(req, res){
    const board = req.params.board;
    
    Thread.find({board}, {delete_password: 0, reported: 0})
    .sort({ bumped_on: -1 }).limit(10)
    .populate({ path: 'replies', options: { limit: 3, sort: { created_on: -1 }, select: { delete_password: 0, reported: 0 } } }).then((threads) => {
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
    .then(thread => {
      if(process.env.NODE_ENV !== 'test')
         res.redirect('/b/' + board)
      else
        res.send('success')
    });
    
  })
  .put(function(req, res){
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    
    Thread
    .findOneAndUpdate({ board, thread_id }, { $set: { reported: true } })
    .then(thread => {
      if(thread)
        res.send('success');
      else
        res.send('thread not found');
    });
    
  })
  .delete(function(req, res){
    const board = req.params.board;
    const thread_id = req.body.thread_id;
    const delete_password = req.body.delete_password;
    
    Thread
    .findOne({ board, thread_id })
    .then(thread => {
      if(thread)
        {
          if(thread.validPassword(delete_password))
            {
              Reply.remove({ thread_id })
              .then(() => {
                thread.remove().then(() => res.send('success'));
              });
            }
          else
            res.send('incorrect password');
        }
      else
        res.send('thread not found')
    });
    
  })
    
  app.route('/api/replies/:board')
  .get(function(req, res){
    const board = req.params.board;
    const thread_id = req.query.thread_id;
    
    Thread.findById(thread_id)
    .select({ delete_password: 0, reported: 0 })
    .populate({ path: 'replies', options: { select: { delete_password: 0, reported: 0 } } })
    .then(thread => res.json(thread));
  })
  .post(function(req, res){
    
    const board = req.params.board;
    
    const reply = new Reply({
      text: req.body.text,
      delete_password: req.body.delete_password,
      thread_id: req.body.thread_id
    })
    
    reply.save()
    .then(reply => {
      return Thread.findOne({ _id: reply.thread_id });
    })
    .then(thread => {
      thread.bumped_on = moment().format('YYYY-MM-DD HH:mm:ss');
      thread.replies.push(reply);
      return thread.save();
    })
    .then(() => {
      if(process.env.NODE_ENV !== 'test')
        res.redirect('/b/' + board + '/' + reply.thread_id)
      else
        res.send('success');
    });
    
  })
  .put(function(req, res){
    const board = req.params.board;
    const reply_id = req.body.reply_id;
    
    Reply.findOneAndUpdate({ _id: reply_id }, { $set: { reported: true } })
    .then(reply => {
      if(reply)
        res.send('success');
      else
        res.send('reply not found')
    })
  })
  .delete(function(req, res){
    const board = req.params.board;
    const reply_id = req.body.reply_id;
    const delete_password = req.body.delete_password;
    
    Reply.findById(reply_id)
    .then(reply => {
      if(reply)
        {
          if(reply.validPassword(delete_password))
            {
              reply.text = "[deleted]";
              reply.save().then(() => res.send('success'));
            }
          else
            res.send('incorrect password');
          
        }
      else
        res.send('reply not found')
    })
  })

};
