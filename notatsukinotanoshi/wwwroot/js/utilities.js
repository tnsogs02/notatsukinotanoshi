/**
 * Notification bar
 */
const NOTI_HTML = '<div class="notification">[text]</div>';

function showNotification(notiMessage, mode) {
    let notiBox = $(NOTI_HTML.replace(/\[text]/g, notiMessage))
        .appendTo($("#notification-area"))
        .slideDown().delay(3000).slideUp();
    notiBox.addClass('noti-' + mode);
}