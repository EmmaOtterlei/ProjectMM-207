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

function showMenuNotLoggedIn() {
    loadTemplate("MenuNotLoggedIn", containerMenu);

    // Wait for the next event loop tick to ensure the DOM has been updated
    setTimeout(() => {
        document.getElementById("Login").onclick = showLogin;
        document.getElementById("Createuser").onclick = showCreateUser;
        document.getElementById("Decks").onclick = showDecks;
        document.getElementById("FlashcardCreation").onclick = showFlashcardCreation;
    }, 0);
}


function showMenuLoggedIn() {
    // Load the template into the containerMenu
    loadTemplate("MenuLoggedIn", containerMenu);

    // Ensure the DOM is updated before attempting to add event listeners
    setTimeout(() => {
        document.getElementById("MyUser").addEventListener("click", function() {
            showUser(); 
        });

        document.getElementById("Logout").addEventListener("click", function() {
            showLoggedOut(); 
        });

        // Setting up the event listener for the "Decks" button
        document.getElementById("Decks").addEventListener("click", function() {
            showDecks(); // Assuming you have a function showDecks() defined somewhere
        });

        // Setting up the event listener for the "Flashcard Creation" button
        document.getElementById("FlashcardCreation").addEventListener("click", function() {
            showFlashcardCreation(); // Assuming you have a function showFlashcardCreation() defined somewhere
        });
    }, 0);
}


function showLogin() {
    // Display login form
    loadTemplate("loginTemplate", containerContent);

    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const userCredentials = { email, password };

        try {
            const response = await postTo("/user/login", userCredentials);
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
                localStorage.setItem('userId', responseData.userId);
                showUser();
                showMenuLoggedIn();
            } else {
                console.error("Login failed: ", response.status, response.statusText);
                // Optionally, provide user feedback here
            }
        } catch (error) {
            console.error("Error during login request:", error);
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
  //  loadTemplate("decksTemplate", containerContent);

}

function showLoggedOut(){
    localStorage.removeItem('userId'); 
    sessionStorage.removeItem('userId'); 
    showLogin();
    showMenuNotLoggedIn();
    console.log("logged Out");

}


function showUser(userEmail, userName) {
    loadTemplate('userTemplate', containerContent);

    // Update the template with user-specific information
    document.getElementById('userEmail').textContent = userEmail;
    document.getElementById('userName').textContent = userName;

    // Here, add event listeners for form submissions to handle password changes and information updates
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('updateUserInfoForm').addEventListener('submit', handleUpdateUserInfo);
    document.getElementById('deleteButton').addEventListener('click', handleDeleteUserInfo);
}

async function handleDeleteUserInfo() {
    // Assuming you have a way to get the current user's ID
    const userId = getCurrentUserId(); // Implement this function based on your application's logic

    if (!userId) {
        alert("User ID is not available. Unable to delete user.");
        return;
    }

    // Confirm with the user before deletion
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        return; // Stop if the user cancels
    }

    try {
        // Send a DELETE request to the server
        const response = await fetch(`/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Include any necessary authentication headers
            },
        });

        if (response.ok) {
            alert("Your account has been successfully deleted.");
            showLoggedOut;
        } else {
            // Handle server-side errors (e.g., user not found, server error)
            const error = await response.json();
            alert(`Failed to delete account: ${error.message || "Server error"}`);
        }
    } catch (error) {
        console.error("Error during delete request:", error);
        alert("Error deleting account. Please try again later.");
    }
}


async function handleChangePassword(event) {
    event.preventDefault();
    const newPassword = document.getElementById('newPassword').value;

    // Assuming you have a function to get the current user's ID securely
    const userId = getCurrentUserId(); // Implement this function as per your application's auth mechanism

    try {
        const response = await fetch(`/user/changePassword`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, newPassword }),
        });

        if (response.ok) {
            alert("Password changed successfully.");
            // Optionally, redirect the user or clear the form
        } else {
            // Handle unsuccessful response
            alert("Failed to change password.");
        }
    } catch (error) {
        console.error("Error during password change request:", error);
        // Handle network or other errors
        alert("Error changing password.");
    }
}

async function showFlashcardCreation(){
    //loadTemplate("flashcardCreationTemplate", containerContent);
}

function getCurrentUserId() {
    return localStorage.getItem('userId');
}

async function handleUpdateUserInfo(event) {
    event.preventDefault();
    const userId = await getCurrentUserId(); // Make sure you await if getCurrentUserId is async

    if (!userId) {
        console.error("User ID is undefined.");
        return; // Exit the function if userId is not found
    }

    const newEmail = document.getElementById('newEmail').value;
    const newUsername = document.getElementById('newUsername').value;

    const user = { newEmail, newUsername };

    try {
        // Use the putTo function to send the PUT request
        const response = await putTo(`/user/${userId}`, user);

        if (response.ok) {
            alert("User information updated successfully.");
            // Optionally, refresh the page or update the UI accordingly
        } else {
            // Handle unsuccessful response
            alert("Failed to update user information.");
        }
    } catch (error) {
        console.error("Error during user information update request:", error);
        // Handle network or other errors
        alert("Error updating user information.");
    }
}



