/* Entre Nosotros — service worker SOLO para notificaciones push.
   No intercepta la red ni cachea nada: la app sigue funcionando igual. */
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  const title = d.title || "💌 Entre Nosotros";
  const body = d.body || "Tu persona agregó algo nuevo";
  e.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "icon-192.png",
      badge: "icon-192.png",
      data: { url: d.url || "./" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
      for (const w of ws) {
        if (w.url.startsWith(self.registration.scope)) { w.focus(); return; }
      }
      return clients.openWindow(url);
    })
  );
});
