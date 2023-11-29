const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("BROWSER KAMU TIDAK MENDUKUNG LOCAL STORAGE");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const unreadedBookList = document.getElementById("unread-book-list");
  unreadedBookList.innerHTML = "";

  const readedBookList = document.getElementById("readed-book-list");
  readedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isReaded) {
      unreadedBookList.append(bookElement);
    } else {
      readedBookList.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const titleBook = document.getElementById("title").value;
  const authorBook = document.getElementById("author").value;
  const yearBook = document.getElementById("year").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, titleBook, authorBook, yearBook, isReaded) {
  return {
    id,
    titleBook,
    authorBook,
    yearBook,
    isReaded,
  };
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = "Judul:" + bookObject.titleBook;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis:" + bookObject.authorBook;
  const textYear = document.createElement("p");
  textYear.innerText = "Tahun:" + bookObject.yearBook;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book-list");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (!bookObject.isReaded) {
    const doneButton = document.createElement("button");
    doneButton.classList.add("button");
    doneButton.innerText = "Selesai Dibaca";
    doneButton.style.backgroundColor = "green";

    doneButton.addEventListener("click", function () {
      addBookToReaded(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.style.backgroundColor = "Red";

    trashButton.addEventListener("click", function () {
      removeBookFromReaded(bookObject.id);
    });

    container.append(doneButton, trashButton);
  } else {
    const dontButton = document.createElement("button");
    dontButton.classList.add("button");
    dontButton.innerText = "Belum Selesai Dibaca";
    dontButton.style.backgroundColor = "orange";

    dontButton.addEventListener("click", function () {
      dontBookToReaded(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.style.backgroundColor = "Red";

    trashButton.addEventListener("click", function () {
      removeBookFromReaded(bookObject.id);
    });

    container.append(dontButton, trashButton);
  }

  return container;
}

function addBookToReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function dontBookToReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isReaded = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromReaded(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
