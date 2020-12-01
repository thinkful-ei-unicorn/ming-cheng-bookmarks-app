const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ming';

const listApiFetch = function (...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                error = {code: res.status};
                if (!res.headers.get('content-type').includes('json')) {
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }
            return res.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        })
}

function getItems() {
    return listApiFetch(`${BASE_URL}/bookmarks`);
}

function createItem(title, url, description, rating) {
    const newData = JSON.stringify({"title": title, "url": url, "desc": description, "rating": rating, "expended": false});
    console.log(newData)
    return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newData
  });
}

function updateItem(id, newName){
    const updateData = JSON.stringify(newName);
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateData
      });
}

const deleteItem = function (id) {
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE'
    });
  };

export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};