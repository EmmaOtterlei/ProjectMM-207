import { insertTemplatesFrom, cloneTemplate } from "../source/utility.mjs";
import User from "../model/user.mjs";

const UserInfoView = {};
const templateSource = "views/userInfoTemplate.html"
const templateID = "userInfoTemplate"
const viewID = "userInfo"
let template = null;
let view = null;
let currentModel = null;

UserInfoView.displayView = async function (model, target) {
    // The utilities for the view.
    await onBeforeDisplay(model, target);

    if (view == null) {
        onSetup(model, target);
    } else {
        onReload(model, target);
    }

    currentModel = model;
}

UserInfoView.remove = function () {
    const item = document.getElementById(viewID);
    item.remove();
    view = null;
}

UserInfoView.onLogoutEventHandler = null;

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
    target.querySelector("#logoutBt").addEventListener("click", onLogOutClicked);
    target.querySelector("h1").innerHTML = `Hello ${model.name}`;
}


function onLogOutClicked(e) {
    UserInfoView.remove();
    if (UserInfoView.onLogoutEventHandler != null) {
        UserInfoView.onLogoutEventHandler();
    }
}

function onReload(model, target) {
    // The view is visible, but there has been a reload event...
}


export default UserInfoView;