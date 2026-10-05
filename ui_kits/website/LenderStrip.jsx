/* Accredited-lender logo strip. A single row of logos scrolling continuously,
   greyscale by default and full colour on hover (the whole row pauses on hover).
   Data from window.MeshContent.lenders; logos in assets/lenders/. Rendered as the
   last section of the homepage, just above the footer. */
function LenderStrip() {
  const lenders = window.MeshContent.lenders || [];
  /* Duplicate the set so the track can loop seamlessly: the animation shifts by
     exactly one copy's width (-50%), and each logo carries its own right margin
     so both halves are identical (no half-gap seam at the wrap point). */
  const row = lenders.concat(lenders);

  return (
    <section style={ls.wrap} aria-label="Lenders Mesh Finance is accredited with">
      <style>{`
        .mesh-lender-strip{ overflow:hidden; position:relative;
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent); }
        .mesh-lender-track{ display:flex; width:max-content; align-items:center;
          animation:mesh-lender-scroll 55s linear infinite; }
        .mesh-lender-strip:hover .mesh-lender-track{ animation-play-state:paused; }
        /* Normalise by HEIGHT so every logo sits at the same cap height and on one
           baseline; width flows naturally. A max-width stops the few ultra-wide
           wordmarks from dominating. All logos are vertically centred in the row. */
        .mesh-lender-item{ flex:none; height:52px; margin-right:44px;
          display:flex; align-items:center; justify-content:center; }
        .mesh-lender-logo{ max-height:38px; max-width:250px; width:auto; height:auto; object-fit:contain; }
        @keyframes mesh-lender-scroll{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        @media (prefers-reduced-motion: reduce){
          .mesh-lender-track{ animation:none; flex-wrap:wrap; justify-content:center; width:auto; }
          .mesh-lender-item{ margin:8px 22px; }
        }
      `}</style>
      <div style={ls.inner}>
        <p style={ls.eyebrow}>Proudly accredited with 25+ lenders</p>
        <div className="mesh-lender-strip">
          <div className="mesh-lender-track">
            {row.map((l, i) => {
              /* Per-logo optical sizing: `scale` nudges an individual logo up or
                 down from the shared 38px / 250px caps without touching the rest. */
              const s = l.scale || 1;
              const sized = s !== 1 ? { maxHeight: (38 * s) + "px", maxWidth: (250 * s) + "px" } : null;
              return (
                <div key={i} className="mesh-lender-item">
                  <img className="mesh-lender-logo" src={"../../assets/lenders/" + l.file}
                    alt={l.name} loading="lazy" draggable="false" style={sized}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const ls = {
  wrap: { background: "#fff", padding: "44px 0", borderTop: "1px solid var(--border-subtle)" },
  inner: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 28px" },
  eyebrow: { textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".08em",
    textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 26px" },
};

Object.assign(window, { MeshLenderStrip: LenderStrip });
