var locale = ((lang) => {
    // get full list from https://stackoverflow.com/a/36042028
    switch (lang) {
        case 'zh-TW':
        case 'zh-CN':
        case 'zh-HK':
        case 'zh-SG':
            return 'en';
        // return 'zh'; - No Chinese template
        case 'ja':
            return 'ja';
        default:
            return 'en';
    }
})(navigator.language);
let _locale = (locale == "zh" ? "en" : locale);

$(document).ready(() => {
    //Get all mail templates
    $.getJSON("./resources/email-template." + _locale + ".json", function (data) {
        mailTemplate = data;
    }).complete(function () {
        update();
    });

    $("select#lang").val(locale);
});

class Sponsor {
    constructor(jp, ch, en, p_jp = "", p_en = "", email) {
        this.company = {
            "ja": jp,
            "zh": ch,
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
    //new Sponsor("株式会社KADOKAWA", "KADOKAWA公司", "KADOKAWA CORPORATION", "", "", "seki@kadokawa.co.jp"),
    new Sponsor("株式会社テレビ東京", "東京電視台", "TV TOKYO Corporation", "", "", "privacy@txshop.jp"),
    //new Sponsor("株式会社ファミマ・ドット・コム", "famima.com", "famima.com Co., Ltd.", "ファミリーマート", "Family Mart", ""),
    //new Sponsor("日本ビクター株式会社", "JVC", "JVC", "音楽CD", "Audio CD", ""),
    new Sponsor("クランチロール", "Crunchyroll", "Crunchyroll", "ネット放送サービス", "Web Broadcast Service", "support@crunchyroll.com"),
    new Sponsor("アニメシアターX", "AT-X", "AT-X", "テレビ放送サービス", "TV Broadcast Service", "ppinfo@at-x.com"),
    new Sponsor("株式会社エス・ワイ・エス", "SYS公司", "SYS Inc.", "プリントサービス", "Printing Service", "info@sys-inc.jp"),
    new Sponsor("エイジグローバルネットワークス株式会社", "Age Global Networks", "Age Global Networks", "", "", "info@age-global.net"),
    new Sponsor("株式会社ジャストプロ", "JustPro", "Just Production Inc.", "", "", "info@just-pro.jp"),
    //new Sponsor("株式会社ドコモ・アニメストア", "DOCOMO動畫商城", "DOCOMO ANIME STORE, INC.", "ネット配信サービス", "Web Broadcast Service", "support@animate-onlineshop.jp"),
    new Sponsor("株式会社ブシロード", "株式會社武士道", "Bushiroad Inc.", "", "", "support@bushiroad.com"),
    new Sponsor("株式会社クロックワークス", "KlockWorx", "KlockWorx Co.ltd", "DVDレンタル", "DVD Rental Service", "info@klockworx.com"),
    //new Sponsor("日清食品グループ", "日清食品", "Nissin Food Group", "どん兵衛", "どん兵衛", "release@nissinfoods-holdings.co.jp"),
    //new Sponsor("けものフレンズカフェ", "動物朋友咖啡", "JAPARI CAFÉ CONCEPT", "DVD Rental Service", "JAPARI CAFÉ", "japaricafe.tokyo@gmail.com"),
    new Sponsor("株式会社ウルトラダイレクト", "Ultra Direct", "Ultra Direct", "けものフレンズカフェ", "JAPARI CAFÉ", "japaricafe.tokyo@gmail.com"),
    new Sponsor("にいがたアニメ・マンガフェスティバル実行委員会事務局", "新潟動漫節執行委員會", "The Niigata Anime and Manga Festival Committee", "がたふぇす限定グッズ", "Limited Goods", "bunka@city.niigata.lg.jp"),
    //new Sponsor("那須どうぶつ王国", "那須動物王國", "Nasu Animal Kingdom", "コラボグッズ", "Collaboration Goods", ""),
    //new Sponsor("日本中央競馬会", "日本中央競馬會", "JRA", "", "", "inter@jra.go.jp"),
    new Sponsor("オンキヨー株式会社", "ONKYO", "Onkyo Corporation", "イヤホン", "Earphone", "customer@jp.onkyo.com"),
    //new Sponsor("株式会社ファミリーマート", "全家便利商店株式會社", "Familymart Co., Ltd.", "オリジナルグッズ", "Original Collboration Goods", "")
];

const langs = {
    'zh': {
        langText: '中文',
        g: "Gmail",
        q: "QR Code",
        t: "傳統郵件(開啟郵件客戶端)",
        name: "朋友的名字",
        country: "朋友的國籍",
        recv: "收件公司",
        submit: "跳轉到發送頁面",
        modeText: ["Gmail (電腦)", "電子郵件 (手機)"]
    },
    "ja": {
        langText: '日本語',
        g: "Gmail",
        q: "QR コート",
        t: "メールソフトで開く",
        mailSubject: ["けものフレンズの件について", "けものフレンズコラボの件について"],
        name: "フレンズの名前",
        country: "フレンズの縄張り",
        recv: "紙飛行機の届き先",
        submit: "メールのページへ",
        modeText: ["Gmail (パソコン)", "メール (携帯)"]
    },
    "en": {
        langText: 'English',
        g: "Gmail",
        q: "QR Code",
        t: "Traditional mail",
        mailSubject: ['About your company\'s collaboration with Kemono Friends', 'Kemono Friends Inquiry'],
        name: "Friends\' name",
        country: "Friends\' nationality",
        recv: "Which to send",
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
var author = $('#sender');
var country = $('#country');
let mailTemplate = "";

function update() {
    mailBodyIndex = parseInt(Math.random() * mailTemplate.length);
    mailBody = mailTemplate[mailBodyIndex]['msg']
        .replace(/%company_name%/g, $('#sp').text())
        .replace(/%user_name%/g, author.val())
        .replace(/%user_nationality%/g, country.val());
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

function updateLang() {
    locale = $("select#lang").val();
    _locale = (locale == "zh" ? "en" : locale);
    update();
}

function updateRecv() {
    recv = sps[parseInt($("#sp").val())];
    update();
}

$("#sp").on("change", updateRecv);
$("select#lang").on("change", updateLang);
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
    if (!author.val().length) {
        return alert("Please input your username!");
    }
    if (!country.val().length) {
        return alert("Please input your nationality!");
    }
    var subject = langs[_locale]["mailSubject"][parseInt(Math.random() * langs[_locale]["mailSubject"].length)]
    var link = mailAPI[mode]
        .replace("!SUBJECT!", encodeURIComponent(subject))
        .replace("!RECV!", encodeURIComponent($("#sp").val()))
        .replace("!BODY!", encodeURIComponent(mailBody))
    window.open(link, "_blank").focus()
}