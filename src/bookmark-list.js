import $ from 'jquery';
import store from './store';
import api from './api'
import item from './item'

/*
const generateAddBookmarkPage = function () {
  console.log("page generate")
  return `<h1>My Bookmarks</h1>
  <form id="js-bookmark-list-form">
    <div class="error-container">some text</div>

    
    <label for="url">New Bookmarks:</label>
    <input id="url" type="text" name="url" placeholder="http://samplelink.code/newbookmarks" required><br><br>

    <label for="title">Title:</label>
    <input id="title" type="text" name="title" placeholder="Music"><br><br>

    <label for="rating">rating</label>
    <input id="rating" type="text" name="rating" placeholder="eg. 1-5"><br><br>

    <label for="description"></label>
    <textarea id="description" name="description" placeholder="Add a description (optional)"></textarea><br><br>
    <button type="submit">add New Bookmarks</button>
    </form>
    
    <select id="mySelect" name="property" size="1">
      <option value="1">Rating 1 star</option>
      <option value="2">Rating 2 star</option>
      <option value="3">Rating 3 star</option>
      <option value="4">Rating 4 star</option>
      <option value="5">Rating 5 star</option>
    </select>
      `
}
*/

const handleFilterClick = function () {
$('.dropdown').on('change', '#mySelect', () => {
  let filterValue = $('#mySelect, option:selected').val();
  console.log(filterValue)
  store.filterItemByRating(filterValue);
  //store.filter = filterValue;
  render();
})

};


const generateItemElement = function (item) {
  let itemTitle = `<p>${item.title}</p>`
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        <button type="button" class="collapsible">${itemTitle} Rating: ${item.rating} stars</button>
        <div class="content">
          <p>Description: ${item.desc}</p>
          <button onclick="window.open('${item.url}', '_blank'); return false;">Visit site</button>
          <div class="shopping-item-controls">
            <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
            </button>
          </div>
        </div>
      </li>`;
      
  };
/*
const generateItemElement = function (item) {
let itemTitle = `<p>${item.title}</p>`
  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      <p>${item.desc}</p>
      <p>Rating: ${item.rating}</p>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
    
};
*/
const generateBookmarkItemsString = function (bookmarkList) {
  const items = bookmarkList.map(item => generateItemElement(item));
  return items.join('');
}

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const showCollapsible = function () {
  let coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
      store.items.expanded = !store.items.expanded;
      //console.log(store.items.id, store.items.expanded)
    });
  }
}

const render = function () {
  renderError();
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];

  // render the shopping list in the DOM
  
  if (store.filter === 0){
    const bookmarkListItemsString = generateBookmarkItemsString(items);
    $('.js-bookmark-list').html(bookmarkListItemsString);
  }else {
    items = items.filter(item => item.rating >= store.filter);
    let html = generateBookmarkItemsString(items);
    $('.js-bookmark-list').html(html);
  }
  // insert that HTML into the DOM
  
  showCollapsible();
};


const handleNewItemSubmit = function (){
  $('#js-bookmark-list-form').submit(function (event) {
    event.preventDefault();
    console.log('click')
    const url = $('#url').val();
    const title = $('#title').val();
    const rating = $('#rating').val();
    const description = $('#description').val();

    item.validateUrl(url);
    item.validateTitle(title);

    $('#url').val('');
    $('#title').val('');
    $('#rating').val('');
    $('#description').val('');
    
    api.createItem(title, url, description, rating)
      .then(newItem => {
        store.addItem(newItem);
        render();
      })
      .catch(error => store.setError(error.message))
  })
}
/*
const handleNewItemSubmit = function () {
  
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');

    api.createItem(newItemName)
    .then(newItem => {
      store.addItem(newItem);
      render();
    })
    .catch(error => store.setError(error.message));
  });
};
*/

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  return $('.js-bookmark-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        console.log(error);
        store.setError(error.message);
        renderError();
      })
  });
};
/*
const handleDeleteItemClicked = function () {
  $('.js-bookmark-list').on('click', '.js-item-delete', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        console.log(error);
        store.setError(error.message);
        renderError();
      })
  })
}
*/
const handleEditShoppingItemSubmit = function () {
  $('.js-shopping-list').on('submit', '.js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.shopping-item').val();
    api.updateItem(id, { name: itemName })
      .then(() => {
        store.findAndUpdate(id, { name: itemName });
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};
/*
const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);

    api.updateItem(id, { checked: !item.checked })
      .then(() => {
        store.findAndUpdate(id, { checked: !item.checked });
        render()
        .catch((error) => {
          store.setError(error.message);
          renderError();
        });
      });
    
  });
};

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
};
*/
const bindEventListeners = function () {
  handleNewItemSubmit();
  handleDeleteItemClicked();
  handleEditShoppingItemSubmit();
  handleCloseError();
  handleFilterClick();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};