/**
 * jQuery scripts
 */
let _locale = ($('#culture-input').val() === "zh" ? "en" : $('#culture-input').val());
$(document).ready(() => {
    recv = sps[parseInt($("#Sponsor").val())];

    //Get all mail templates
    $.getJSON("/resources/email-template." + _locale + ".json", function (data) {
        mailTemplate = data;
    }).complete(function () {
        update();
    });
});

$('form').submit(function (e) {
    e.preventDefault();
    console.log("Submitting");
    $.post($(this).attr("action"), $(this).serialize(), function () {
        sendEmail();
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

const sps = [
    new Sponsor("Crunchyroll", "ネット放送サービス", "Web Broadcast Service", "support@crunchyroll.com"),
    new Sponsor("AT-X", "テレビ放送サービス", "TV Broadcast Service", "ppinfo@at-x.com"),
    new Sponsor("SYS Inc.", "プリントサービス", "Printing Service", "info@sys-inc.jp"),
    new Sponsor("Age Global Networks", "", "", "info@age-global.net"),
    new Sponsor("Just Production Inc.", "", "", "info@just-pro.jp"),
    new Sponsor("Bushiroad Inc.", "", "", "support@bushiroad.com"),
    new Sponsor("KlockWorx Co.ltd", "DVDレンタル", "DVD Rental Service", "info@klockworx.com"),
    new Sponsor("Ultra Direct", "けものフレンズカフェ", "JAPARI CAFÉ", "japaricafe.tokyo@gmail.com"),
    new Sponsor("The Niigata Anime and Manga Festival Committee", "がたふぇす限定グッズ", "Limited Goods", "bunka@city.niigata.lg.jp"),
    new Sponsor("Onkyo Corporation", "イヤホン", "Earphone", "customer@jp.onkyo.com"),
];

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
function update() {
    mailBodyIndex = parseInt(Math.random() * mailTemplate.length);
    mailBody = mailTemplate[mailBodyIndex]['msg']
        .replace(/%company_name%/g, recv.company['en'])
        .replace(/%user_name%/g, $("#FriendName").val())
        .replace(/%user_nationality%/g, $("#FriendName").val());
    $("#mailBody").html(mailBody)
    /* $("h4#mode").html("Mode: " + langs[locale]["modeText"][mode]);

    $("button#g").html(langs[locale]["g"])
    $("button#t").html(langs[locale]["t"])

    $("#sp").find("option").remove().end()
    for (var i in sps) {
        $("#sp").append($("<option></option>").attr("value", i).text(sps[i].company[locale]))
    }
    $("#sp").val(sps.indexOf(recv)) */

    $("div#email").html("Email: " + $("#sp").val());
}

function updateRecv() {
    recv = sps[parseInt($("#Sponsor").val())];
    update();
}

$("#Sponsor").on("change", updateRecv);

$("input#sender").on("input", () => {
    update();
})

$("input#country").on("input", () => {
    update();
})

function mailAction(e) {
    mode = parseInt(e.dataset["type"])
    update();
}

function sendEmail() {
    var subject = langs[_locale]["mailSubject"][parseInt(Math.random() * langs[_locale]["mailSubject"].length)]
    var link = mailAPI[mode]
        .replace("!SUBJECT!", encodeURIComponent(subject))
        .replace("!RECV!", encodeURIComponent(recv.email))
        .replace("!BODY!", encodeURIComponent(mailBody))
    window.open(link, "_blank").focus()
}