async function insertTemplatesFrom(source, target) {
    const templates = await fetch(source).then(d => d.text());
    target.insertAdjacentHTML("beforeend", templates);
}

function cloneTemplate(template) {
    return template.content.cloneNode(true)
}

export { insertTemplatesFrom, cloneTemplate }