const { nanoid } = require('nanoid');
const books = require('./books');

const postBookRequest = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal',
  });
  response.code(400);
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  const book = books.map((forBook) => {
    const data = {};
    data.id = forBook.id;
    data.name = forBook.name;
    data.publisher = forBook.publisher;
    return data;
  });

  if (name !== undefined) {
    const fName = book.filter((fBook) => fBook.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: fName.map((forBook) => ({
          id: forBook.id,
          name: forBook.name,
          publisher: forBook.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '0' || reading === '1') {
    const fReading = books.filter((fRead) => fRead.reading === true);
    const ufReading = books.filter((ufRead) => ufRead.reading === false);
    if (reading === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: fReading.map((forBook) => ({
            id: forBook.id,
            name: forBook.name,
            publisher: forBook.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    if (reading === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: ufReading.map((forBook) => ({
            id: forBook.id,
            name: forBook.name,
            publisher: forBook.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (finished === '0' || finished === '1') {
    const fFinised = books.filter((fFinis) => fFinis.finished === true);
    const ufFinised = books.filter((ufFinis) => ufFinis.finished === false);
    if (finished === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: fFinised.map((forBook) => ({
            id: forBook.id,
            name: forBook.name,
            publisher: forBook.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    if (finished === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: ufFinised.map((forBook) => ({
            id: forBook.id,
            name: forBook.name,
            publisher: forBook.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: book,
    },
  });
  response.code(200);
  return response;
};

const getDetailBook = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editDataBook = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postBookRequest,
  getAllBooks,
  getDetailBook,
  editDataBook,
  deleteBook,
};
