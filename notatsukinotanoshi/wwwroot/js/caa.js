$(document).ready(function () {
    let modalBtnSubmit = $("#modalBtnSubmit");
    let modelContentView = $("#mailContentView");
    let sendModal = $("#modal");

    $("#modalBtnSubmit").click(function (e) {
        e.preventDefault();

        // Copy to clipboard
        copyToClipboard(modelContentView.get(0));
        //Open ACA page
        window.open("https://form.caa.go.jp/shohisha/opinion-0003.php");
        sendModal.modal("hide");
    });
});