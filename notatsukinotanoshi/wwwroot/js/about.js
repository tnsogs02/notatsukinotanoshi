//The message
const callout = '<div class="bs-callout bs-callout-warning tweets-content"><img style="float: left; margin:8px" src="[profile-pic]"><b>[tweet-name]</b> - <span data-time="[tweet-time]" class="tweet-time"></span><p>[replace-text]</p></div>';

var socket = io.connect('https://socket.savejaparipark.com');
socket.on('tweet', function (data) {
    let user = data.user;
    let tweets = $("#tweets");
    tweets.prepend(
        callout.replace('[replace-text]', data.text)
            .replace('[tweet-name]', user.name)
            .replace('[tweet-time]', data.created_at)
            .replace('[profile-pic]', user.profile_image_url_https)
    );

    //Update time when a new tweet is published
    tweets.find("span.tweet-time").each(function () {
        $(this).text(DateFormat.format.prettyDate($(this).data("time")));
    });

    //Remove old tweets
    let content = $("#tweets > .tweets-content");
    if (content.length > 5) {
        content.last().remove();
    }
});