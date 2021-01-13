//autofill edit book
function handleEditBook() {
    let data = JSON.parse(document.activeElement.getAttribute("data-book"));

    //without jquery
    document
        .querySelector("#bookModal form")
        .setAttribute("action", "/admin/books/edit");
    document.querySelector("#bookModal #modalLabel").textContent = "Edit Info";
    document.querySelector("#bookModal #url").value = window.location.pathname;
    document.querySelector("#bookModal #idBook").value = data._id;
    document.querySelector("#bookModal #title").value = data.title
        ? data.title
        : "";
    document.querySelector("#bookModal #author").value = data.author
        ? data.author
        : "";
    document.querySelector("#bookModal #year").value = data.year
        ? data.year
        : "";
    document.querySelector("#bookModal #quantity").value = data.quantity
        ? data.quantity
        : "";
    document.querySelector("#bookModal #publisher").value = data.publisher
        ? data.publisher
        : "";
    document.querySelector("#bookModal #author").value = data.author
        ? data.author
        : "";
    document.querySelector("#bookModal #category").value = data.category
        ? data.category
        : "";
    document.querySelector("#bookModal #description").value = data.description
        ? data.description
        : "";
}
