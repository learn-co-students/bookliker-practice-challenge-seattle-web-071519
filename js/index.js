document.addEventListener("DOMContentLoaded", main);


function main(){
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(json => renderBooks(json))
}

function renderBooks(json){
    let list = document.getElementById('list')

    for(let book of json){
        let title = document.createElement('h4')
        title.setAttribute('book-id',book.id)
        title.textContent = book.title

        title.addEventListener('click',getBookToShow)


        list.appendChild(title)
    }
    
};

function getBookToShow(event){
    let bookId = event.target.getAttribute('book-id') - 1

    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(json => showBook(json[bookId]))
};

function showBook(book){
    let showPanel = document.getElementById("show-panel")

    while (!!showPanel.firstChild){
        showPanel.removeChild(showPanel.firstChild)
    }

    let thumbNail = document.createElement('img')
    thumbNail.setAttribute('src',book.img_url)
    showPanel.appendChild(thumbNail)

    let desc = document.createElement('p')
    desc.textContent = book.description
    showPanel.appendChild(desc)

    let liked = false

    let likers = document.createElement('ul')
    showPanel.appendChild(likers)

    for(let i = 0; i < book.users.length; i++){
        if (book.users[i].id == 1){ liked = true }

        let li = document.createElement('li')
        li.innerText = book.users[i].username
        likers.appendChild(li)
    }

    let likeButton = document.createElement('button')
    if (liked){
        likeButton.textContent = 'Unlike this Book'
    } else {
        likeButton.textContent = 'Like this Book'
    }
    showPanel.appendChild(likeButton)
    likeButton.setAttribute('book-id',book.id)
    likeButton.addEventListener('click',toggleLike)
}

function toggleLike (event) {
    bookId = event.target.getAttribute('book-id') - 1
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(json => updateLikes(json[bookId],event.target))
}

function updateLikes(book,button){
    let extantUser = false
    for(let user of book.users){
        if (user.id == 1){ extantUser = true}
    }

    let users = book.users
    if (extantUser == true){
        users = users.filter(function (user){
           return user.id != 1
        })
    } else {
        users.push({"id":1, "username":"pouros"})
    }

    let url = `http://localhost:3000/books/${book.id}`
    fetch(url, {
        method: 'PATCH',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "users": users,
          })
    })


    fetch(`http://localhost:3000/books/${book.id}`)
    .then(res => res.json())
    .then(json => showBook(json))

}