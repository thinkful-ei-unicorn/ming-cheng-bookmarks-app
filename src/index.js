import $ from 'jquery';

import 'normalize.css';
import './index.css';

import bookmarkList from './bookmark-list';
import api from './api';
import store from './store'

const main = function () {
  api.getItems()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarkList.render();
    })

  bookmarkList.bindEventListeners();
  bookmarkList.render();

};



$(main);
