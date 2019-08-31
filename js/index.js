document.addEventListener("DOMContentLoaded",main);

function main() {
    fetchBooks()
}

function fetchBooks(){
    return fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => renderBooks(json))
}

function renderBooks(booksArray){
    let ul = document.getElementById("list")
    booksArray.forEach(function(book){
        let li = document.createElement("li")
        li.innerText = book.title
        let showButton = document.createElement("button")
        showButton.addEventListener("click", showBook(book))
        showButton.innerText = "Expand Book"

        li.appendChild(showButton)
        ul.appendChild(li)

    })
}

function showBook(book) {
    return function(e) {
        let div = document.getElementById("show-panel")
        while (div.firstChild){
            div.firstChild.remove()
        }
       
        let titleHeader = document.createElement("h1")
        titleHeader.innerText = book.title
        let bookImg = document.createElement("img")
        bookImg.src = book.img_url
        let bookDescription = document.createElement("p")
        bookDescription.innerText = book.description
        let usersButton = document.createElement("button")
        usersButton.innerText = "Read Book"
        usersButton.addEventListener("click", addSelfToUsers(e,book))

        div.appendChild(titleHeader)
        div.appendChild(bookImg)
        div.appendChild(bookDescription)
        div.appendChild(usersButton)
    }

}

function showUsers(e,book){
    return function(e){
        let div = document.getElementById("show-panel")
        let ol = document.createElement("ol")
        div.appendChild(ol)
        book.users.forEach(function(user){
            let li = document.createElement("li")
            li.id = user.id
            li.innerText = user.username
            ol.appendChild(li)
        })
    }
}

function addSelfToUsers(e,book){
    return function(e){
    console.log(book.users)
    let me = {id: 1, username: "pouros"}
     book.users.push(me)
     let array = book.users

    fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PATCH",
    headers:{
        "Content-Type": 'application/json'
    },
    body: JSON.stringify({
        users: array
        })
    }).then(response => response.json())
    .then(json => showUsers(e,book))
    }
}