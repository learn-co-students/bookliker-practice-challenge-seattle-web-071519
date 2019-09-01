document.addEventListener("DOMContentLoaded", main);

function main() {
    fetchBooks()
}

fetchBooks = () => {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(booksData => showBooksList(booksData))
}

showBooksList = (booksData) => {
    let bookList = document.querySelector("#list")
    for (let i =0; i < booksData.length; i++) {
        let bookLi = document.createElement("li")
        bookLi.innerText = booksData[i].title
        bookLi.setAttribute("data-book-id", `${booksData[i].id}`)
        bookLi.addEventListener("click", fetchBookInfo)
        bookList.appendChild(bookLi)
    }
}

function fetchBookInfo(e) {
    // debugger
    let bookId = e.target.dataset.bookId
    fetch(`http://localhost:3000/books/${bookId}`)
    .then(response => response.json())
    .then(bookData => showBookInfo(bookData))
}

showBookInfo = (bookData) => {
    let bookContainer = document.querySelector("#show-panel")
    while (bookContainer.firstChild) {
        bookContainer.firstChild.remove()
    }
    let bookTitle = document.createElement("h2")
    bookTitle.textContent = bookData.title
    bookTitle.setAttribute("data-book-id", `${bookData.id}`)
    let bookCover = document.createElement("img")
    bookCover.src = bookData["img_url"]
    let bookDescription = document.createElement("p")
    bookDescription.textContent = bookData.description
    let userDiv = document.createElement("div")
    userDiv.innerText = "User Likes"
    let userList = document.createElement("ul")
    let likeBtn = document.createElement("button")
    likeBtn.innerText = "Like"
    likeBtn.addEventListener("click", updateLikeList(bookData))
    for (let i = 0; i < bookData.users.length; i++) {
        let username = document.createElement("li")
        username.innerText = bookData.users[i].username
        userList.appendChild(username)
        if (bookData.users[i].id == 1) {
            likeBtn.innerText = "Remove Like"
        }
    }    
    userDiv.appendChild(userList)
    userDiv.appendChild(likeBtn)

    bookContainer.appendChild(bookTitle)
    bookContainer.appendChild(bookCover)
    bookContainer.appendChild(bookDescription)
    bookContainer.appendChild(userDiv)
}

function updateLikeList(bookData) {
    return function(e) {
        let bookId = bookData.id
        let bookUsers = bookData.users
        if (e.target.innerText == "Like") {
            bookUsers.push({ "id": 1, "username": "pouros" })
        } else {
            // debugger
            bookUsers.pop()
            //since this is only dealing with one user, if user is on the like list they will always be the last on the list
        }
        // debugger
        fetch(`http://localhost:3000/books/${bookId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                users: bookUsers
            })
        }).then(response => response.json())
        .then(json => showBookInfo(json))
    }
}

// rewrite to account for if the user is already on the like list
// flipBtnText = (e) => {
//     if (e.target.innerText == "Like") {
//         e.target.innerText = "Remove Like"
//     } else {
//         e.target.innerText = "Like"
//     }
// }