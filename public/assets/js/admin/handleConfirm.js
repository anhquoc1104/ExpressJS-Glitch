$("#confirmModal").on("hidden.bs.modal", function () {
    $(this).find("form").trigger("reset");
});
//autofill edit book
function handleConfirm() {
    let data = JSON.parse(document.activeElement.getAttribute("data-book"));
    let id = data.idCart ? data.idCart : data.idTransaction;
    let action = data.idCart
        ? "/admin/carts/checkout"
        : "/admin/transactions/isComplete";
    let form = $("#confirmModal form");

    form.attr("action", action);
    $("#confirmModal #id").val(id);
}
