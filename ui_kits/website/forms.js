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
