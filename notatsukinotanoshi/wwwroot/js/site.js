/**
 * jQuery scripts
 */

//Shared variables
let _locale = ($('#culture-input').val() === "zh" ? "en" : $('#culture-input').val());
let templateBody = "";

//Cached selectors
let friendName = $("#FriendName");
let friendCountry = $("#FriendCountry");
let companyName = $("#Sponsor");
let companyMail = $("#sp-email").val();

$(document).ready(() => {
    generate();
});

$('form').submit(function (e) {
    e.preventDefault();
    console.log("Adding count...");
    let verified = false;
    $.ajax({
        type: 'POST',
        url: $(this).attr("action"),
        data: $(this).serialize(),
        dataType: "json",
        async: false,
        success: function (data) {
            if (data === "success") {
                sendEmail();
            }
        },
        fail: function () {
            showNotification('Internal error', "danger");
        }
    });

    $.post($(this).attr("action"), $(this).serialize(), function (data) {
        if (data === "success") {
            $("#btn--send-mail").click();
        }
    }, 'json');
});

$("#btn--preview").click(function (e) {
    e.preventDefault();
    generate();
});

$("#Sponsor").on("change", fillTemplate);
$("input").on("input", fillTemplate);

/**
 * Helper class
 */
class Sponsor {
    constructor(en, p_jp = "", p_en = "", email) {
        this.company = {
            "en": en
        };
        this.product = {
            "ja": p_jp,
            "zh": p_en,
            "en": p_en
        };
        this.email = email;
    }
}

const langs = {
    'zh': {
        langText: '中文',
        g: "Gmail",
        q: "QR Code",
        t: "傳統郵件(開啟郵件客戶端)",
        submit: "跳轉到發送頁面",
        modeText: ["Gmail (電腦)", "電子郵件 (手機)"]
    },
    "ja": {
        langText: '日本語',
        g: "Gmail",
        q: "QR コート",
        t: "メールソフトで開く",
        mailSubject: ["けものフレンズの件について", "けものフレンズコラボの件について"],
        submit: "メールのページへ",
        modeText: ["Gmail (パソコン)", "メール (携帯)"]
    },
    "en": {
        langText: 'English',
        g: "Gmail",
        q: "QR Code",
        t: "Traditional mail",
        mailSubject: ['About your company\'s collaboration with Kemono Friends', 'Kemono Friends Inquiry'],
        submit: "Compose an email",
        modeText: ["Gmail (For PC)", "E-Mail (For Mobile)"]
    }
}

const mailAPI = {
    0: "https://mail.google.com/mail/?view=cm&fs=1&to=!RECV!&su=!SUBJECT!&body=!BODY!",
    1: "mailto:!RECV!?subject=!SUBJECT!&body=!BODY!"
}

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
var mode = (isMobile ? 1 : 0)
let mailTemplate = "";

let recv = "";

/**
 * Functions
 */
function mailAction(e) {
    mode = parseInt(e.dataset["type"])
    update();
}

/**
 * Generate and send the mail
 */
function sendEmail() {
    //Build the URI
    let bodyText = $('#mail-body').text();
    let subject = langs[_locale]["mailSubject"][parseInt(Math.random() * langs[_locale]["mailSubject"].length)];
    let link = mailAPI[mode]
        .replace("!SUBJECT!", encodeURIComponent(subject))
        .replace("!RECV!", encodeURIComponent(companyMail))
        .replace("!BODY!", encodeURIComponent(bodyText));

    //Open the mail
    window.open(link, "_blank").focus();
}

/**
 * Generate template
 * @param {any} func
 */
function generate() {
    $.ajax({
        type: 'POST',
        url: "/Api/Generate",
        data: $("#form--submit-mail").serialize(),
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                let info = data['returnData'];
                templateBody = info['template'];
                $("#sp-email").val(info['email']);
                fillTemplate();
            } else {
                showNotification(data.message, "danger");
            }
        },
        fail: function () {
            showNotification('Internal error', "danger");
        }
    });
}

/**
 * Manipulate the template and edit apprear on screen
 */
function fillTemplate() {
    $("#mail-body").html(templateBody
        .replace(/%company_name%/g, companyName.find(":selected").text())
        .replace(/%user_name%/g, friendName.val())
        .replace(/%user_nationality%/g, friendCountry.val())
    );
}