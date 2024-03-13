import { insertTemplatesFrom, cloneTemplate } from "../source/utility.mjs";
import User from "../model/user.mjs";

const LoginView = {};
const templateSource = "views/loginViewTemplate.html"
const templateID = "logginViewTemplate"
const viewID = "loginForm"
let template = null;
let view = null;
let currentModel = null;
let container = null;


LoginView.displayView = async function (model, target) {

    container = target;
    // The utilities for the view.
    await onBeforeDisplay(model, target);

    if (view == null) {
        onSetup(model, target);
    } else {
        onReload(model, target);
    }

    currentModel = model;
}

LoginView.remove = () => {
    const item = container.querySelector("#" + viewID);
    item.remove();
    view = null;
}

LoginView.onLoginEventHandler = null;


async function onBeforeDisplay(model, target) {
    if (currentModel == null) {
        currentModel = model;
    }

    if (template == null) {
        await insertTemplatesFrom(templateSource, target);
        template = document.getElementById(templateID);
    }
}

function onSetup(model, target) {
    view = cloneTemplate(template);
    target.append(view);
    target.querySelector("button").addEventListener("click", onLoginClicked);
}

function onLoginClicked(e) {
    if (LoginView.onLoginEventHandler) {
        let user = User();
        user.name = document.getElementById("userName").value;
        LoginView.remove();
        LoginView.onLoginEventHandler(user);
    }
}

function onReload(model, target) {
    // The view is visible, but there has been a reload event...
}






export default LoginView;