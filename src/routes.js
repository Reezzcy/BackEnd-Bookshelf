const {
  postBookRequest,
  getAllBooks,
  getDetailBook,
  editDataBook,
  deleteBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBookRequest,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getDetailBook,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editDataBook,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBook,
  },
];

module.exports = routes;
