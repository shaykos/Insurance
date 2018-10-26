

export function notify(title, message) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification(title, {
      icon: '../../assets/images/logo.png',
      body: message,
      tag: 'אב הבית'
    });

    notification.onclick = function () {
      //window.open("http://stackoverflow.com/a/13328397/1269037");
    };

  }
}
