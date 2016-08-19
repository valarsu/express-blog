/**
 * Created by valarsu on 2016/8/16.
 */
var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post
}

//存储一篇文章及其相关信息
Post.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() +
        ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);//错误，返回err信息
        }
        //读取posts集合
        db.collection('posts', function (err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入posts集合
            collection.insert(post, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null);//成功，err为null，并返回存储后的用户文档
            })
        });
    });
};

//读取文章及其相关信息
Post.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        //读取 post 集合
        db.collection('posts', function (err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //根据query对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                //解析markdown为html
                docs.forEach(function (doc) {
                    doc.post = markdown.toHTML(doc.post);
                });
                mongodb.close();
                if (err) {
                    return callback(err);//失败
                }
                callback(null, docs);
            });
        })
    });
};


module.exports = Post;
