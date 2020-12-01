
const validateUrl = function (url) {
    if (!url) throw new TypeError('URL must not be blank!');
  };
  
  const validateTitle = function (title) {
    if (!title) throw new TypeError('Title must not be blank!');
  };
  
  export default {
    validateUrl,
    validateTitle
  }