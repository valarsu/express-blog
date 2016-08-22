/**
 * Created by valarsu on 2016/8/16.
 */

var mongodb = require('./db');

function Comment(name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

Comment.prototype.save = function (callback) {
  var name = this.name,
      day = this.day,
      title = this.title,
      comment = this.comment;
  mongodb.open(function (err, db) {
      if (err) {
          return callback(err);
      }
      db.collection('posts', function (err, collection) {
          if (err) {
              mongodb.close();
              return callback(err);
          }
          //通过用户名.时间和标题查找一篇文章,并把一条留言对象添加到该稳当的comments数组里
          collection.update({
              'name': name,
              'time.day': day,
              'title': title
          }, {
              $push: {'comments' : comment}
          }, function (err) {
              mongodb.close();
              if (err) {
                  return callback(err);
              }
              callback(null);
          });
      });
  });  
};


module.exports = Comment;
