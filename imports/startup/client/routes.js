import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// components
import App from './../../ui/components/App';
import Login from './../../ui/components/Login';
import Signup from './../../ui/components/Signup';
import Sections from './../../ui/components/Sections';
import NotFound from './../../ui/components/NotFound';

const publicPages = ['/', '/signup'];
const privatePages = ['/sections'];

const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/sections');
  }
};
const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  }
};

export const onAuthChange = (isAuthenticated) => {
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isPublicPage = publicPages.includes(pathname);
  const isPrivatePage = privatePages.includes(pathname);

  // if public page and logged in - let them in
  if (isPublicPage && isAuthenticated) {
    browserHistory.replace('/sections');
  } else if (isPrivatePage && !isAuthenticated) {
    // if private page and not logged in - kick them out
    browserHistory.replace('/');
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Login } onEnter={ onEnterPublicPage }/>
        <Route path="/signup" component={ Signup} onEnter={ onEnterPublicPage } />
        <Route path="/sections" component={ Sections } onEnter={onEnterPrivatePage} />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root'),
  );
});
