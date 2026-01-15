import { nanoid } from "nanoid";
import books from "./books.js";

// POST /books
export const createBook = (req, res, next) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  // VALIDASI NAMA (Client tidak melampirkan properti namepada request body)
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  // VALIDASI HALAMAN (Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount)
  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // NILAI FINISHED DIDAPAT DARI (pageCount === readPage)
  const finished = pageCount === readPage;
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

  books.push(newBook);

  return res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
};

// GET /books
export const getBooks = (req, res) => {
    const simplifiedBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return res.status(200).json({
        status: "success",
        data: {
            books: simplifiedBooks,
        },
    });
};

// GET /books/:id
export const getBookById = (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (book) {
    return res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  }

  return res.status(404).json({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
};

// PUT /books/:id
export const editBookById = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  const updatedAt = new Date().toISOString();

  // VALIDASI NAMA
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  // VALIDASI HALAMAN
  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    const finished = pageCount === readPage;
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    return res.status(200).json({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
  }

  return res.status(404).json({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
};

// DELETE /books/:id
export const deleteBookById = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return res.status(200).json({
      status: "success",
      message: "Buku berhasil dihapus",
    });
  }

  return res.status(404).json({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
};
