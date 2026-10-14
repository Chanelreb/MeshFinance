/* Shared Formspree submission helper for the site's lead-capture forms
   (homepage hero, Contact page, Referral Hub). Posts the form's own
   FormData so field names in each screen become the Formspree field
   names directly, no per-field mapping needed here. */
const MESH_FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjenagj";

function submitMeshForm(formEl) {
  const data = new FormData(formEl);
  return fetch(MESH_FORMSPREE_ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  }).then((res) => res.ok);
}

Object.assign(window, { MeshSubmitForm: submitMeshForm });

/* Meta (Facebook) conversion events for the campaign landing pages.
   The pixel library itself is loaded by Google Tag Manager, but the Lead and
   Schedule events are fired from here so conversions never depend on a GTM
   trigger being set up. Two pixel IDs are known for this site: the one Chanel
   supplied from Events Manager (1364666885761207) and the one GTM's "Meta -
   Pixel" tag loads (1298807639047990). Each event is sent to both so the ad
   account sees it whichever dataset its campaigns use. Once the correct one is
   confirmed, drop the other from MESH_META_PIXELS. */
const MESH_META_PIXELS = ["1364666885761207", "1298807639047990"];

function meshMetaEvent(eventName, params) {
  const fire = () => {
    const state = (window.fbq && window.fbq.getState) ? window.fbq.getState() : null;
    const loaded = state ? state.pixels.map((p) => p.id) : [];
    MESH_META_PIXELS.forEach((id) => {
      if (!loaded.includes(id)) window.fbq("init", id);
      window.fbq("trackSingle", id, eventName, params || {});
    });
  };
  if (typeof window.fbq === "function") { fire(); return; }
  /* fbq not on the page yet (GTM still loading, or blocked): install the
     standard stub, which queues calls until fbevents.js arrives. */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  MESH_META_PIXELS.forEach((id) => { window.fbq("init", id); window.fbq("trackSingle", id, eventName, params || {}); });
}

Object.assign(window, { MeshMetaEvent: meshMetaEvent });

