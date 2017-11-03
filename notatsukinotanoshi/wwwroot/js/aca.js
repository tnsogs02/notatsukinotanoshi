$(document).ready(function () {
    var loading = $("#loading");
    var btnSendConfirm = $("#btnSendConfirm");
    var sendModal = $("#modal");
    var modalBtnSubmit = $("#modalBtnSubmit");

    btnSendConfirm.click(function (e) {
        e.preventDefault();
        let selectedTarget = $("input[name='target']:checked");
        console.log(selectedTarget);
        //var selectedTarget = $("#btnGroupSendTarget label.active input");
        if (selectedTarget.length == 1) {
            loading.fadeIn();
            $.post("/Api/GenerateACA", function (data) {
                sendModal.find(".modal-header h1").text("寄信給 " + selectedTarget.val() + " - 確認信件內容");
                $("#mailContentView").html(data['returnData']['template']);
                console.log(data);
                // 設定信件資料
                sendModal.modal();
                loading.fadeOut();
            }, 'json');
            /* (function () {
                // AJAX取得自動生成的信件資料
                // 程式目前為等候兩秒後直接出現視窗
                setTimeout(function () {
                    sendModal.find(".modal-header h1").text("寄信給 " + selectedTarget.val() + " - 確認信件內容");

                    // 設定信件資料

                    sendModal.modal();
                    loading.fadeOut();
                }, 2000);
            }, 1); */
        } else {
            alert("您還沒有選取您要寄信的對象，幸運獸無法處理喔！");
        }
    });

    $("#modalBtnSubmit").click(function (e) {
        e.preventDefault();

        // AJAX送出訊息的處理

        $modal.modal("hide");
    });
});