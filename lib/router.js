Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return [Meteor.subscribe('notifications')];
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  onBeforeAction: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  limit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().fetch().length === this.limit();
    var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? nextPath : null
    }
  }
});


Router.map(function() {
  this.route('postPage', {
    path: '/posts/:_id',
    data: function() { return Posts.findOne(this.params._id); },
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    }
  });

  this.route('postSubmit', {
    path: '/submit',
    disableProgress: true
  });

  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
  });

  this.route('postsList', {
    path: '/:postsLimit?',
    controller: PostsListController
  });

});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
    pause();
  }
}

Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(function() { clearErrors() });
Router.onBeforeAction('loading');
