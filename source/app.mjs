import LoginView from "../controllers/loginView.mjs";
import UserInfoView from "../controllers/userInfoView.mjs";

let userInfo = JSON.parse(localStorage.getItem("user")); // Get our user if there is one 
await renderDisplay();

async function renderDisplay() {

    // If we have a user then we want to show info about that user.
    if (userInfo != null) {
        await UserInfoView.displayView(userInfo, document.body);
        UserInfoView.onLogoutEventHandler = onLogOut;
    } else {
        // if there is no user we want to display a login view.
        await LoginView.displayView({}, document.body);
        LoginView.onLoginEventHandler = onLogin;
    }
}

// When a user successfully logsin
function onLogin(user) {
    userInfo = user;
    localStorage.setItem("user", JSON.stringify(user));
    renderDisplay();
}

// When a user logsout
function onLogOut() {
    userInfo = null;
    localStorage.removeItem("user");
    renderDisplay();
}