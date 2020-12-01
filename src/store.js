import cuid from "cuid";


const items = [];
let error = null;
let adding = false;
let filter= 0;


const findById = function (id) {
  return this.items.find(currentItem => currentItem.id === id);
};

const setError = function (error) {
  this.error = error;
};

const addItem = function (item) {
  this.adding = false;
  console.log(item)
  this.items.push(item);
  this.adding = !this.adding;
  console.log(this.adding)
};

const findAndDelete = function (id) {
  this.items = this.items.filter(currentItem => currentItem.id !== id);
  //const itemId = this.items.findIndex(item => item.id === id);
  //this.items.splice(itemId, 1);
};

const toggleCheckedFilter = function () {
  this.hideCheckedItems = !this.hideCheckedItems;
};

const findAndUpdate = function (id, newData) {
  const currentItem = this.findById(id);
  Object.assign(currentItem, newData);
}


const filterItemByRating = function (rating) {
  this.items = this.items.filter(currentItem => currentItem.rating >= rating);
}


export default {
  items,
  error,
  adding,
  filter,
  findById,
  addItem,
  findAndUpdate,
  setError,
  findAndDelete,
  toggleCheckedFilter,
  filterItemByRating
};