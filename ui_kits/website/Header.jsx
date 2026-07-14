/* Site header, sticky nav with dropdown menus matching the real site's grouping. */
function Header({ onNav, current }) {
  const { Button } = window.MeshFinanceDesignSystem_5c98d0;
  const { Phone, Menu, Close, ChevronDown } = window.MeshIcons;
  const { useState } = React;
  const [openId, setOpenId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [mobileOpenId, setMobileOpenId] = useState(null);
  const nav = window.MeshContent.nav;
  const isMobile = window.useIsMobile();

  /* Grace period before closing, so the dropdown survives the cursor
     travelling from the trigger link into the panel (and brief overshoots). */
  const closeTimer = React.useRef(null);
  const openMenu = (id) => { clearTimeout(closeTimer.current); setOpenId(id); };
  const scheduleClose = (id) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(o => (o === id ? null : o)), 160);
  };
  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  const go = (id) => { onNav(id); setOpenId(null); setMenuOpen(false); setMobileOpenId(null); };

  return (
    <header style={hdr.bar}>
      <div style={hdr.inner}>
        <a href="#" onClick={(e)=>{e.preventDefault();go("home");}} style={hdr.logoWrap}>
          <img src="../../assets/mesh-logo.png" alt="Mesh Finance" style={{height:38,display:"block"}}/>
        </a>

        {!isMobile && (
          <nav style={hdr.nav}>
            {nav.map(item => (
              <div key={item.id} style={hdr.navItem}
                onMouseEnter={()=>openMenu(item.id)} onMouseLeave={()=>scheduleClose(item.id)}>
                <a href="#" onClick={(e)=>{e.preventDefault();go(item.id);}}
                  style={{...hdr.link, ...(current===item.id?hdr.linkActive:{})}}>
                  {item.label}
                </a>
                {item.children && openId===item.id && (
                  <div style={hdr.dropdownWrap}>
                    <div style={hdr.dropdown}>
                      {item.children.map(ch => (
                        <a key={ch.id} href="#" onClick={(e)=>{e.preventDefault();go(ch.id);}}
                          style={{...hdr.dropLink, ...(current===ch.id?hdr.dropLinkActive:{})}}>{ch.label}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}

        {!isMobile && (
          <div style={hdr.right}>
            <a href="tel:+61416291241" style={hdr.phone}>
              <Phone width={17} height={17} style={{color:"var(--color-primary)"}}/>
              0416 291 241
            </a>
            <Button variant="primary" size="sm" onClick={()=>go("contact")}>Book now</Button>
          </div>
        )}

        {isMobile && (
          <button aria-label="Open menu" onClick={()=>setMenuOpen(o=>!o)} style={hdr.burger}>
            {menuOpen ? <Close width={24} height={24}/> : <Menu width={24} height={24}/>}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={hdr.mobilePanel}>
          {nav.map(item => (
            <div key={item.id} style={hdr.mobileItem}>
              <div style={hdr.mobileRow}>
                <a href="#" onClick={(e)=>{e.preventDefault();go(item.id);}}
                  style={{...hdr.mobileLink, ...(current===item.id?hdr.linkActive:{})}}>{item.label}</a>
                {item.children && (
                  <button aria-label="Toggle submenu"
                    onClick={()=>setMobileOpenId(o=>o===item.id?null:item.id)}
                    style={{...hdr.mobileChevron, transform: mobileOpenId===item.id ? "rotate(180deg)" : "none"}}>
                    <ChevronDown width={18} height={18}/>
                  </button>
                )}
              </div>
              {item.children && mobileOpenId===item.id && (
                <div style={hdr.mobileSub}>
                  {item.children.map(ch => (
                    <a key={ch.id} href="#" onClick={(e)=>{e.preventDefault();go(ch.id);}}
                      style={{...hdr.mobileSubLink, ...(current===ch.id?hdr.dropLinkActive:{})}}>{ch.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div style={hdr.mobileFoot}>
            <a href="tel:+61416291241" style={hdr.phone}>
              <Phone width={17} height={17} style={{color:"var(--color-primary)"}}/>
              0416 291 241
            </a>
            <Button block variant="primary" size="md" onClick={()=>go("contact")}>Book now</Button>
          </div>
        </div>
      )}
    </header>
  );
}

const hdr = {
  bar: { position:"sticky", top:0, zIndex:20, background:"rgba(255,255,255,.92)",
    backdropFilter:"blur(10px)", borderBottom:"1px solid var(--border-subtle)" },
  inner: { maxWidth:"var(--container-max)", margin:"0 auto", height:74, padding:"0 28px",
    display:"flex", alignItems:"center", gap:24 },
  logoWrap: { display:"flex", alignItems:"center" },
  nav: { display:"flex", gap:2, marginLeft:8, flex:1 },
  navItem: { position:"relative" },
  link: { fontFamily:"var(--font-body)", fontSize:14, fontWeight:600, color:"var(--text-muted)",
    textDecoration:"none", padding:"8px 12px", borderRadius:"var(--radius-sm)", display:"inline-block" },
  linkActive: { color:"var(--color-primary)" },
  /* Wrapper starts flush with the trigger (top:100%) and carries the visual
     4px offset as padding, so there is no dead zone the cursor can fall into
     between the link and the panel. */
  dropdownWrap: { position:"absolute", top:"100%", left:0, paddingTop:4, zIndex:30 },
  dropdown: { background:"#fff",
    border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", boxShadow:"var(--shadow-md)",
    padding:8, display:"flex", flexDirection:"column", minWidth:220 },
  dropLink: { fontSize:13.5, fontWeight:500, color:"var(--text-body)", textDecoration:"none",
    padding:"9px 12px", borderRadius:"var(--radius-sm)", whiteSpace:"nowrap" },
  dropLinkActive: { color:"var(--color-primary)", background:"var(--blue-50)" },
  right: { display:"flex", alignItems:"center", gap:18 },
  phone: { display:"flex", alignItems:"center", gap:7, fontFamily:"var(--font-display)",
    fontWeight:700, fontSize:14, color:"var(--navy-700)", textDecoration:"none" },

  burger: { marginLeft:"auto", flex:"none", width:42, height:42, display:"flex", alignItems:"center",
    justifyContent:"center", background:"transparent", border:"none", color:"var(--navy-700)", cursor:"pointer" },
  mobilePanel: { borderTop:"1px solid var(--border-subtle)", background:"#fff", padding:"8px 20px 20px",
    display:"flex", flexDirection:"column", gap:2, maxHeight:"calc(100vh - 74px)", overflowY:"auto" },
  mobileItem: { borderBottom:"1px solid var(--border-subtle)" },
  mobileRow: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  mobileLink: { fontFamily:"var(--font-body)", fontSize:16, fontWeight:600, color:"var(--text-strong)",
    textDecoration:"none", padding:"14px 4px", display:"block", flex:1 },
  mobileChevron: { flex:"none", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
    background:"transparent", border:"none", color:"var(--text-muted)", cursor:"pointer", transition:"transform .15s" },
  mobileSub: { display:"flex", flexDirection:"column", gap:2, paddingBottom:10 },
  mobileSubLink: { fontSize:14.5, fontWeight:500, color:"var(--text-body)", textDecoration:"none",
    padding:"9px 4px 9px 14px", borderRadius:"var(--radius-sm)" },
  mobileFoot: { display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:18 },
};

Object.assign(window, { MeshHeader: Header });
