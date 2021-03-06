var crypto = require('crypto'),
  User = require('../models/user.js'),
  Post = require('../models/post.js');
var path = require('path');
var fs = require('fs');
var url = require('url');
module.exports = function(app) {
  app.get('/', function(req, res) {
    var nice = Post.get(null, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('index', {
        title: '主dsdsssss页',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
    console.log(nice);

  });
  app.get('/nice.html', function(req, res) {

  });
  app.get('/ajax', function(req, res) {
    var obj = {
      name: "nice"
    };
    console.log("1")
    res.send(obj);
  });
  app.post('/nice.do', function(req, res) {
    var gyfnice = req.body;
    console.log(gyfnice.nice);
    res.send("you success");
  });
  app.get('/123.html', function(req, res) {

    res.render('123', {
      title: '主dsdsssss页'
    });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/loadpic', function(req,res) {
    console.log(req.files);
    var me = req;
    var oldpath = req.files.displayImage.path;
    fs.readFile(req.files.displayImage.path, function(err,data) {
      var newPath = __dirname + "/uploads/uploadedFileName";
      var filename = path.basename(oldpath);
      var imgPath = "http://localhost:3000" + "/uploads/uploadedFileName/" + filename;
      console.log(imgPath);
      fs.writeFile(newPath, data, function(err) {
        res.redirect("back");
      });
    });
  })
  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
    var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致!');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name: req.body.name,
      password: password,
      email: req.body.email
    });
    User.get(newUser.name, function(err, user) {
      if (user) {
        req.flash('error', '用户已存在!');
        return res.redirect('/reg');
      }
      newUser.save(function(err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success', '注册成功!');
        res.redirect('/');
      });
    });
  });

  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在!');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '密码错误!');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/');
    });
  });

  app.get('/post', checkLogin);
  app.get('/post', function(req, res) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin);
  app.post('/post', function(req, res) {
    var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发布成功!');
      res.redirect('/'); //发表成功跳转到主页
    });
  });

  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录!');
      res.redirect('/login');
    }
    next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!');
      res.redirect('back');
    }
    next();
  }
};