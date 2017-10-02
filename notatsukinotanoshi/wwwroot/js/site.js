/**
 * jQuery scripts
 */
let _locale = ($('#culture-input').val() === "zh" ? "en" : $('#culture-input').val());

$('form').submit(function (e) {
    e.preventDefault();
    console.log("Submitting");
    $.post($(this).attr("action"), $(this).serialize(), function () {
        sendEmail();
    });
});

$("#btn--preview").click(function (e) {
    e.preventDefault();
    generate(function (data) {
        if (data.status === "success") {
            $("#mail-body").html(data['returnData']['template']);
        } else {
            showNotification(data.message, "danger");
        }
    });
});
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
    generate(function (data) {
        let info = data['returnData'];
        let subject = langs[_locale]["mailSubject"][parseInt(Math.random() * langs[_locale]["mailSubject"].length)];
        let link = mailAPI[mode]
            .replace("!SUBJECT!", encodeURIComponent(subject))
            .replace("!RECV!", encodeURIComponent(info['email']))
            .replace("!BODY!", encodeURIComponent(info['template']))
        window.open(link, "_blank").focus()
    });    
}

/**
 * Generate template
 * @param {any} func
 */
function generate(func) {
    $.post("/Home/Generate", $("#form--submit-mail").serialize(), func, "json");
}