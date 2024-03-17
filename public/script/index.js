"use strict"

let containerContent = null;
let containerMenu = null;

document.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
    containerContent = document.getElementById("containerContent");
    containerMenu = document.getElementById("containerMenu");
    showCreateUser();
    showMenuNotLoggedIn();

}

function showMenuNotLoggedIn(){
    loadTemplate("MenuNotLoggedIn", containerMenu);
    const login = document.getElementById("Login");
    const createUser = document.getElementById("Create user");
    const decks = document.getElementById("Decks");
    const flashcardCreation = document.getElementById("Flashcard Creation");
    login.onclick = showLogin;
    createUser.onclick = showCreateUser;
    decks.onclick = showDecks;
    flashcardCreation.onclick = showFlashcardCreation;
}

function showMenuLoggedIn(){
    loadTemplate("MenuLoggedIn", containerMenu);
    const myUser = document.getElementById("My User");
    const logOut = document.getElementById("Log Out");
    const decks = document.getElementById("Decks");
    const flashcardCreation = document.getElementById("Flashcard Creation");
    myUser.onclick = showLogin;
    logOut.onclick = showCreateUser;
    decks.onclick = showDecks;
    flashcardCreation.onclick = showFlashcardCreation;
}

function showLogin() {
    // Display login form
    loadTemplate("loginTemplate", containerContent);

    // Add event listener for login button
    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();

        // Get email and password input values
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;

        // Send the email and plain password to the server
        const userCredentials = { email, password };

        try {
            // Send login request to server
            const response = await postTo("/user/login", userCredentials) 
            if (response.ok) {
                // Login successful, show user dashboard or perform other actions
                const responseData = await response.json();
                console.log(responseData.message);
                showUser();
            } else {
                // Login failed, handle error
                console.error("Login failed: ", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during login request:", error);
            // Handle other errors, such as network errors
        }
    });
    const createUserRedirect = document.getElementById("createUserRedirect");
    createUserRedirect.onclick = showCreateUser;
}

function showCreateUser(){
    loadTemplate("createUserTemplate", containerContent);

    const createUserButton = document.getElementById("createUserButton");

    createUserButton.onclick = async function (e) {

        const userName = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const pwsHash = document.getElementById("pwsHash").value;

        const user = { email, pwsHash, userName };
        try {
            const response = await postTo("/user", user);
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                showLogin();
            } else {
                console.error("Failed to create user. Server returned:", response.status, response.statusText);
                // Handle the error appropriately
            }
        } catch (error) {
            console.error("Error during POST request:", error);
            // Handle the error appropriately
        }
    };
    
    const loginRedirect = document.getElementById("loginRedirect");
    loginRedirect.onclick = showLogin;
}

function showDecks(){
    loadTemplate("decksTemplate", containerContent);

}

function showFlashcardCreation(){
    loadTemplate("flashcardCreationTemplate", containerContent);
}

function showUser(){
    loadTemplate("userTemplate", containerContent);
}

