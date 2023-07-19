// wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    fetchDucks();
    const likesButton = document.getElementById('duck-display-likes')
    likesButton.addEventListener("click", (e) => {
        e.preventDefault();
        const duckName = document.getElementById('duck-display-name').innerText
        fetch("http://localhost:3000/ducks")
            .then(r => r.json())
            .then(data => likeDuck(duckName, data))
    })
    document.getElementById('new-duck-submit').addEventListener("click", (e) => {
        // e.preventDefault()
        const newDuckName = document.getElementById('duck-name-input').value
        const newDuckImg = document.getElementById('duck-image-input').value
        createDuck(newDuckName, newDuckImg);
    })

})


// fetch the ducks
function fetchDucks() {
    fetch("http://localhost:3000/ducks")
        .then(r => r.json())
        .then(ducks => displayDucks(ducks))
};

// display the ducks
function displayDucks(ducks) {
    for (let key in ducks) {
        const singleDuck = ducks[key]
        const duckUrl = singleDuck.img_url
        const duckImg = new Image()
        duckImg.src = duckUrl
        duckImg.addEventListener("click", (e) => {
            e.preventDefault();
            selectDuck(singleDuck);
        })
        document.getElementById("duck-nav").append(duckImg)
    }
}

// select duck and display
function selectDuck(duck) {
    document.getElementById('duck-display-name').innerText = duck.name
    document.getElementById('duck-display-image').src = duck.img_url
    document.getElementById('duck-display-likes').innerText = duck.likes + " likes"
}

// increment likes for duck
function likeDuck(name, data) {
    const duck = data.find(duck => duck.name === name)
    let duckLikes = duck.likes + 1

    fetch(`http://localhost:3000/ducks/${duck.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": duckLikes
        })
    })
        .then(r => r.json())
        .then(duck => document.getElementById('duck-display-likes').innerText = duck.likes + " likes")
}

// add new duck from form
function createDuck(name, image) {
    fetch("http://localhost:3000/ducks", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "img_url": image,
            "likes": 0
        })
    })
        .then(r => r.json())
        .then(newCard => document.getElementById("duck-nav").append(newCard))
}
