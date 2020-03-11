import 'bootstrap.native/dist/bootstrap-native-v4';
import Darkmode from 'darkmode-js';
import Headroom from 'headroom.js';
import React from 'react';
import ReactDOM from 'react-dom';

import { Search } from './search';
import { Redirect } from './redirect';
import { Matomo } from './matomo';
import { SegmentsIndex } from './components/segments-index.jsx';
import './player';

var darkmode = new Darkmode({
  saveInCookies: true,
  label: '<i class="fas fa-lightbulb"></i>',
  autoMatchOsTheme: true
});
darkmode.showWidget();

// Workaround for https://github.com/sandoche/Darkmode.js/issues/7
document.querySelector('.darkmode-toggle').addEventListener('click', function (e) {
  this.style.pointerEvents = 'none';
  setTimeout(() => {
    this.style.pointerEvents = '';
  }, 500);
});

var headroom = new Headroom(document.querySelector('nav'), {
  onPin: function () {
    darkmode.button.hidden = false;

    if (!darkmode.isActivated()) {
      darkmode.layer.hidden = false;
    }
  },
  onUnpin: function () {
    darkmode.button.hidden = true;

    if (!darkmode.isActivated()) {
      darkmode.layer.hidden = true;
    }
  }
});
headroom.init();

// Matomo
Matomo.trackPageView();

// Search
if (document.querySelector('#search')) {
  Search.init('#search');
}

// Redirect
window.Redirect = Redirect;

// Render categories on main page
if (document.querySelector('#segments-grid-root')) {
  ReactDOM.render(
    React.createElement(SegmentsIndex),
    document.querySelector('#segments-grid-root')
  );
}
