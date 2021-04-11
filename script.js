let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
};

function addBookToLibrary() {
    let title = prompt('What is the name of the book?');
    let author = prompt('Who is the the author?');
    let pages = prompt('How many pages it has?');
    let read = confirm('Have you finished reading it?');
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
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
}

function createCard(book, idx) {
    let bookCard = addDiv(idx);
    addSpans(book, bookCard);
    addRemoveButton(bookCard);
    return bookCard;
}

function addDiv(idx) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('book');
    newDiv.setAttribute('data-index', idx);
    return newDiv;
}

function addSpans(book, parent) {
    let bookProperties = Object.keys(book);

    bookProperties.forEach((property) => {
        let newSpan = document.createElement('span');
        newSpan.textContent = book[property];
        parent.appendChild(newSpan);
    });
}

function addRemoveButton(bookCard) {
    let removeButton = document.createElement('button');
    removeButton.addEventListener('click', removeBookCard);
    bookCard.appendChild(removeButton);
}

function removeBookCard(e) {
    let bookIndex = e.target.parentNode.getAttribute('data-index');
    myLibrary.splice(bookIndex, 1);
    updateLibrary();
}

const library = document.querySelector('#library');
const addBookButton = document.querySelector('#add-book');

updateLibrary();
addBookButton.addEventListener('click', addBookToLibrary);
