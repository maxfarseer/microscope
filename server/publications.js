Meteor.publish('posts', function(sort, limit) {
  return Posts.find({}, {sort: sort, limit: limit});
});
Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});
Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});
