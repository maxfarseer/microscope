Posts = new Meteor.Collection('posts');

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user(),
      postWithSameLink = Posts.findOne({url: postAttributes.url});

    // Удостоверимся что пользователь залогинен
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    // Проверим что у поста есть заголовок
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    // Проверим что нет других постов с таким же линком
    if (postAttributes.url && postWithSameLink) {
      throw new Meteor.Error(302,
        'This link has already been posted',
        postWithSameLink._id);
    }

    // Выберем поля разрешенные для публикации
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    var postId = Posts.insert(post);

    return postId;
  }
});
