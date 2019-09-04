document.addEventListener("DOMContentLoaded", fetchBooks)

const booksURL = "http://localhost:3000/books"
const currentUser = {"id":1, "username":"pouros"}

function fetchBooks(event){
    event.preventDefault()
    fetch(booksURL)
        .then(response => response.json())
        .then(books => listBooks(books))
}


function listBooks(books){
    let list = document.getElementById("list")

    books.forEach(book => {
        let li = document.createElement("li")
        li.textContent = book.title
        li.setAttribute("id", book.id)
        li.addEventListener("click", event => {
            fetch(`${booksURL}/${event.target.id}`)
                .then(response => response.json())
                .then(clickedBook => {
                    let elements = createBookCard(clickedBook)
                    elements[0].style.display = "none"
                    elements[1].textContent = "Show Readers"
                })
        })
        list.appendChild(li)
    })
}

function displayBook(event){
    fetch(`${booksURL}/${event.target.id}`)
        .then(response => response.json())
        .then(clickedBook => createBookCard(clickedBook))
            
}

function createBookCard(clickedBook){ 
    let showPanel = document.getElementById("show-panel")
    // clear the existing stuff
    while (showPanel.firstChild) {
        showPanel.removeChild(showPanel.firstChild)
    }

    // make the items that don't really change - title and photo and such
    let h2 = document.createElement("h2")
    h2.textContent = clickedBook.title
    showPanel.appendChild(h2)
    let img = document.createElement("img")
    img.setAttribute("src", clickedBook.img_url)
    showPanel.appendChild(img)  
    let desc = document.createElement("p")
    desc.textContent = clickedBook.description
    showPanel.appendChild(desc)



    // create div to contain all the liking stuff
    let likers = document.createElement("div")
    likers.setAttribute("id", "likers")
    showPanel.appendChild(likers)
    let likerList = listLikers(clickedBook) // creates likerList

    //create read button
    let readButton = document.createElement("button")
    // readButton.setAttribute("book-id", clickedBook.id)
    readButton.setAttribute("id", "like")
            if (alreadyLiked(clickedBook, currentUser.id)){
                readButton.textContent = "Remove Self"
            } else {
                readButton.textContent = "Read Book"
            }
    readButton.addEventListener("click", event => {
        patchBook(clickedBook)
        createBookCard(clickedBook)
    })
    likers.appendChild(readButton)
    
    let showLikersButton = document.createElement("button")
    showLikersButton.setAttribute("book-id", clickedBook.id)
    // showLikersButton.setAttribute("id", "show-likers")
    showLikersButton.addEventListener("click", showLikers)
    likers.appendChild(showLikersButton)

    if (likerList.style.display == "none"){
        showLikersButton.textContent = "Show Readers"
    } else if (likerList.style.display == "block") {
        showLikersButton.textContent = "Hide Readers"
    }

    return [likerList, showLikersButton]
    
}


function patchBook(book){
    let readButton = document.getElementById("like")
    if (readButton.textContent == "Remove Self"){
        // swap button to "Read Book" and remove user from book's users
        readButton.textContent = "Read Book"
        // show reader list
        let likerList = readButton.parentNode.firstChild
        likerList.style.display = "block"

        let userList = book.users.filter(user => {
            return user.id != currentUser.id
        })
        book.users = userList
        
        //update the DOM to show the new likers
        createBookCard(book)

        fetch(`${booksURL}/${book.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
    } else {
        readButton.textContent = "Remove Self"
        // swap button to "Remove Self" and add user to book's users
        book.users.push(currentUser)
        createBookCard(book)

        fetch(`${booksURL}/${book.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
        
    }

} // updates book in database to reflect whether or not user has liked it

function listLikers(book){
    let likers = document.getElementById("likers")
    let likerList = document.createElement('div')
    likerList.setAttribute('id', 'liker-list')
    likerList.style.display = "block"
    likers.appendChild(likerList)
    while (likerList.firstChild) {
        likerList.removeChild(likerList.firstChild)
    }
    for (user in book.users) {
        let h3 = document.createElement("h3")
        h3.textContent = book.users[user].username
        h3.setAttribute("id", user.id)
        likerList.appendChild(h3)
    }
    // let showLikersButton = document.getElementById("show-likers")  
    // showLikersButton.textContent = "Hide Readers"
    return likerList
}

function alreadyLiked(book, user_id){
    for (user in book.users) {
        if (book.users[user].id == user_id){
            return true
        }
    }
    return false
}

function showLikers(event){
    let likers = document.getElementById("likers")
    let likerList = likers.firstChild
    let id = event.target.getAttribute("book-id")
    fetch(`${booksURL}/${id}`)
        .then(response => response.json())
        .then(function(book) {
            if (event.target.textContent == "Show Readers"){
                event.target.textContent = "Hide Readers"
                likerList.style.display = "block"
            } else {
                event.target.textContent = "Show Readers"
                likerList.style.display = "none"
            }
        })
}