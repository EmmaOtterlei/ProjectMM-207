"use strict"


async function postTo(url, data) {
    const header = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const respon = await fetch(url, header);
    return respon;
}

async function putTo(url, data) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    return response;
}


async function hashPasswordClient(password) {
    // Call the server-side endpoint to hash the password
    const response = await fetch('/user/hashPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    if (!response.ok) {
        throw new Error('Failed to hash password');
    }
    const { hashedPassword } = await response.json();
    return hashedPassword;
}






function loadTemplate(templateId, target){
    const t = document.getElementById(templateId).content.cloneNode(true);
    while(target.firstChild){
        target.removeChild(target.firstChild);
    }
    target.appendChild(t);
}