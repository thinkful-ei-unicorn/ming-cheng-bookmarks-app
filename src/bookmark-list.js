import $ from 'jquery';
import store from './store';
import api from './api'
import item from './item'



const generateItemElement = function (item) {
  let itemTitle = `<p>${item.title}</p>`

  if (item.expanded){
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        
        <div>
          <p>${itemTitle}</p>
          <p>Rating: ${item.rating}</p>
          <p>Description: ${item.desc}</p>
          <button onclick="window.open('${item.url}', '_blank'); return false;">Visit site</button>
          <div class="shopping-item-controls">
            <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
            </button>
            <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">close</span>
            </button>
          </div>
        </div>
      </li>`;
  }else {
    return `
    <li class="js-item-element bookmark-item-expanded" data-item-id="${item.id}">
      <div class="bookmark-list-box collapsible">
        <span class="bookmark-item">${item.title}</span>
        <div class="rating-box">Rating: ${item.rating} stars</div>
      </div>
    </li>
    `
  }
      
};

const handleItemExpandClicked = function () {
  $('.main-view').on('click', '.bookmark-item-expanded', event => {
    console.log('expanded')
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);
    item.expanded = !item.expanded;
    render();
  });
};

const handleCloseClicked = function () {
  $('.main-view').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);
    item.expanded = !item.expanded;
    render();
  });
};

const generateAddBookmarkPage = function () {
  if(store.adding) {
    let html = `
    <div class="error-container">some text</div>
    <form id="js-bookmark-list-form" class="new-addBookmark-form">
      
      <label for="url">New Bookmarks:</label>
      <input id="url" type="text" name="url" placeholder="http://samplelink.code/newbookmarks" required><br><br>
  
      <label for="title">Title:</label>
      <input id="title" type="text" name="title" placeholder="Music"><br><br>
  
      <label for="description">Description:</label>
      <textarea id="description" name="description" placeholder="Add a description (optional)"></textarea><br><br>

      <label for="rating">Rating:</label><br>
      <div class="txt-center">
          <input id="star5" name="rating" type="radio" value="5" class="radio-button-hide"/>
          <label for="star5">⭐ ⭐ ⭐ ⭐ ⭐</label><br>
          <input id="star4" name="rating" type="radio" value="4" class="radio-button-hide"/>
          <label for="star4">⭐ ⭐ ⭐ ⭐</label><br>
          <input id="star3" name="rating" type="radio" value="3" class="radio-button-hide"/>
          <label for="star3">⭐ ⭐ ⭐</label><br>
          <input id="star2" name="rating" type="radio" value="2" class="radio-button-hide"/>
          <label for="star2">⭐ ⭐</label><br>
          <input id="star1" name="rating" type="radio" value="1" class="radio-button-hide"/>
          <label for="star1">⭐</label><br>
      <br>
      <button type="submit">add Bookmarks</button>
      <button id="cancel" type="button">Cancel</button>
      </form>
    `
    $('.new-bookmark-form').html(html);
  }else {
    $('.new-bookmark-form').empty();
  }
render();
}

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

const render = function () {
  renderError();
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  items = items.filter(item => item.rating >= store.filter)

  const bookmarkListItemsString = generateBookmarkItemsString(items);
  // render the shopping list in the DOM

  if (store.adding === false){
    let html = `
      <div class="new-bookmark-form">
      </div>
      <div class="first-page-view">
      <header>
        
        <form id="initial-page">
          <button class="first-page-new">
            <span class="button-label">New bookmark</span>
          </button>
          <select id="mySelect" name="mySelect">
            <option>
              <span class="button-label"></span>Filter By</span>
            </option>
            <option value="1">Rating 1 star</option>
            <option value="2">Rating 2 star</option>
            <option value="3">Rating 3 star</option>
            <option value="4">Rating 4 star</option>
            <option value="5">Rating 5 star</option>
              </select>
        <form>
        </header>
        <ul class="bookmark-list js-bookmark-list"></ul>
        </div>
    `
    $('.main-view').html(html);
    $('.js-bookmark-list').html(bookmarkListItemsString);
  }else {
    $('.first-page-view').empty();
  }
 
};

const handleFirstPageNewBookmark = function () {
  $('.main-view').on('click', '.first-page-new', (event) => {
    event.preventDefault();
    store.adding = true;
    generateAddBookmarkPage();
  })
}


const handleCancel = function () {
  $('.main-view').on('click', '#cancel', event => {
    event.preventDefault();
    store.adding = false;
    generateAddBookmarkPage();
    render();
  })
}

const handleNewItemSubmit = function (){
  $('.main-view').on('submit', '#js-bookmark-list-form', event => {
    event.preventDefault();
    const url = $('#url').val();
    const title = $('#title').val();
    const rating = $("input[name='rating']:checked").val();
    const description = $('#description').val();

    item.validateUrl(url);
    item.validateTitle(title);

    $('#url').val('');
    $('#title').val('');
    $("input[name='rating']").val('');
    $('#description').val('');
    
    api.createItem(title, url, description, rating)
      .then(newItem => {
        store.addItem(newItem);
        store.adding=false;
        store.filter = 0;
        generateAddBookmarkPage();
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  })
}

const handleFilterClick = function () {
  $('.main-view').on('change', '#mySelect', () => {
    let filterValue = $('#mySelect, option:selected').val();
    store.filterItemByRating(filterValue);
    //store.filter = filterValue;
    render();
  })
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  return $('.main-view').on('click', '.js-item-delete', event => {
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
  handleFirstPageNewBookmark();
  handleCancel();
  handleItemExpandClicked();
  handleCloseClicked();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};