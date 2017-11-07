//The message
const callout = '<blockquote class="twitter-tweet center-block" data-lang="[sys-locale]"><p lang="[tweet-locale]" dir="ltr">[replace-text]</p>&mdash; [tweet-name] ([screen-name]) <a class="tweet-time" href="https://twitter.com/[screen-name]/status/[tweet-id]" data-time="[tweet-time]"></a></blockquote>';

var address = window.location.protocol + '//' + window.location.host;
var details = {
    resource: (window.location.pathname.split('/').slice(0, -1).join('/') + '/socket.io').substring(1)
};

var socket = io.connect(address, details); 
//var socket = io.connect('https://savejaparipark.com');
socket.on('tweet', function (data) {
    let user = data.user;
    let tweets = $("#tweets");
    tweets.prepend(
        callout.replace(/\[replace-text\]/g, data.text)
            .replace(/\[tweet-name\]/g, user.name)
            .replace(/\[screen-name\]/g, user.screen_name)
            .replace(/\[tweet-id\]/g, data.id_str)
            .replace(/\[tweet-locale\]/g, data.lang)
            .replace(/\[tweet-time\]/g, data.created_at)
            .replace(/\[sys-locale\]/g, $('#culture-input').val())
    );
    twttr.widgets.load(tweets);

    //Update time when a new tweet is published
    tweets.find("a.tweet-time").each(function () {
        $(this).text(DateFormat.format.prettyDate($(this).data("time")));
    });

    //Remove old tweets
    let content = $("#tweets > .twitter-tweet");
    if (content.length > 5) {
        content.last().remove();
    }
});