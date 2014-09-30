Meteor.startup(function () {

    Deps.autorun(function() {
      console.log('There are ' + Posts.find().count() + ' posts');
    });

  });
