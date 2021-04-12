let myLibrary = [];
// Set up our database
let database = firebase.database().ref('database');
// Load our saved database
database.on('value', (snapshot) => {
    myLibrary = snapshot.val().library;
    // Add Book.prototype to every book__proto__ (book.prototype didn't work)
    myLibrary.forEach((book) => (book.__proto__ = Object.create(Book.prototype)));
    updateLibrary();
});
// There are functions to update and delete,
// but I prefer just to replace the whole object in one go
function saveToCloud() {
    database.set({
        library: myLibrary,
    });
}

function Book(title, author, pages, read, image) {
    const defaultImage =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.431PLxi6NCvli-k5zlQ5uwHaLG%26pid%3DApi&f=1';
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? 'Read' : 'Not read';
    this.image = image == '' ? defaultImage : image;
}
Book.prototype.toggleRead = function () {
    this.read = this.read == 'Read' ? 'Not read' : 'Read';
};

function addBookToLibrary() {
    hideBookInfoWindow();

    let title = bookTitle.value;
    let author = bookAuthor.value;
    let pages = bookPages.value;
    let read = bookRead.value;
    let image = bookImage.value;
    let newBook = new Book(title, author, pages, read, image);
    myLibrary.push(newBook);
    // Save myLibrary to Firebase Database
    saveToCloud();
    updateLibrary();
}

function updateLibrary() {
    while (library.firstChild) {
        library.removeChild(library.firstChild);
    }

    myLibrary.forEach((book, index) => {
        let newDiv = createCard(book, index);
        library.appendChild(newDiv);
    });

    addBookButton();
    resetBookInfo();
}

function addBookButton() {
    let newButton = document.createElement('button');
    newButton.textContent = '+';
    newButton.setAttribute('id', 'add-book');
    newButton.onclick = showBookInfoWindow;
    library.appendChild(newButton);
}

function createCard(book, idx) {
    let bookCard = addDiv(idx);
    addRemoveButton(bookCard);
    addImage(book, bookCard);
    addSpans(book, bookCard);
    addReadToggle(book, bookCard);
    return bookCard;
}

function addDiv(idx) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('book');
    newDiv.setAttribute('data-index', idx);
    return newDiv;
}

function addImage(book, parent) {
    let newImage = document.createElement('img');
    newImage.setAttribute('src', book.image);
    parent.appendChild(newImage);
}

function addSpans(book, parent) {
    let spanTitle = document.createElement('span');
    spanTitle.textContent = `Title: ${book.title}`;

    let spanAuthor = document.createElement('span');
    spanAuthor.textContent = `Author: ${book.author}`;

    let spanPages = document.createElement('span');
    spanPages.textContent = book.pages;

    let spanRead = document.createElement('span');
    spanRead.textContent = book.read;

    parent.appendChild(spanTitle);
    parent.appendChild(spanAuthor);
    parent.appendChild(spanPages);
    parent.appendChild(spanRead);
}

function addRemoveButton(bookCard) {
    let removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-btn');
    removeButton.addEventListener('click', removeBookCard);
    bookCard.appendChild(removeButton);
}

function removeBookCard(e) {
    let bookIndex = e.target.parentNode.getAttribute('data-index');
    myLibrary.splice(bookIndex, 1);
    saveToCloud();
    updateLibrary();
}

function addReadToggle(book, parent) {
    let toggleInput = document.createElement('input');
    toggleInput.setAttribute('type', 'checkbox');
    if (book.read == 'Read') toggleInput.checked = true;
    toggleInput.addEventListener('click', (e) => {
        book.toggleRead();
        updateLibrary();
    });

    parent.appendChild(toggleInput);
}

function showBookInfoWindow() {
    bookInfoWindow.style['display'] = 'grid';
}
function hideBookInfoWindow() {
    bookInfoWindow.style['display'] = 'none';
}

function resetBookInfo() {
    bookTitle.value = '';
    bookAuthor.value = '';
    bookPages.value = '';
    bookRead.value = '';
    bookImage.value = '';
}

const library = document.querySelector('#library');
const bookInfoWindow = document.querySelector('#book-info');
const bookTitle = document.querySelector('#book-title');
const bookAuthor = document.querySelector('#book-author');
const bookPages = document.querySelector('#book-pages');
const bookRead = document.querySelector('#book-read');
const bookImage = document.querySelector('#book-image');
const bookCancel = document.querySelector('#book-cancel');
const bookConfirm = document.querySelector('#book-confirm');

updateLibrary();
addBookButton.onclick = showBookInfoWindow;
bookCancel.onclick = hideBookInfoWindow;
bookConfirm.onclick = addBookToLibrary;
