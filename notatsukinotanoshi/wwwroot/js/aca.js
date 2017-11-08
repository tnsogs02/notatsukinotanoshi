$(document).ready(function () {
    let loading = $("#loading");
    let btnSendConfirm = $("#btnSendConfirm");
    let sendModal = $("#modal");
    let modalBtnSubmit = $("#modalBtnSubmit");
    let content = $("#mailContentView");
    let sendTo = "";

    btnSendConfirm.click(function (e) {
        e.preventDefault();
        let selectedTarget = $("input[name='target']:checked");
        console.log(selectedTarget);
        //var selectedTarget = $("#btnGroupSendTarget label.active input");
        if (selectedTarget.length === 1) {
                    loading.fadeIn();
                    $.post("/Api/GenerateACA", function (data) {
                        sendModal.find(".modal-header h1").text("寄信給 " + selectedTarget.val() + " - 確認信件內容");
                        content.html(data['returnData']['template']);
                        sendTo = selectedTarget.data("link");

                        // 設定信件資料
                        sendModal.modal();
                        loading.fadeOut();
                    }, 'json');
        } else {
            alert("您還沒有選取您要寄信的對象，幸運獸無法處理喔！");
        }
    });

    $("#modalBtnSubmit").click(function (e) {
        e.preventDefault();

        // Copy to clipboard
        copyToClipboard(content.get(0));

        //Open ACA page
        window.open(sendTo);
        sendModal.modal("hide");
    });
});