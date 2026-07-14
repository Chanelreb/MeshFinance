/* Mesh Finance, website icon set (Lucide-style line icons, 24×24, 1.8 stroke).
   The brand site uses custom raster icons we couldn't access; these are a
   consistent CDN-equivalent (Lucide) substitute, see README ICONOGRAPHY. */
const I = (p, vb = "0 0 24 24") => (props) => (
  <svg viewBox={vb} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{p}</svg>
);

const Home = I(<><path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/></>);
const Building = I(<><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></>);
const Key = I(<><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L20 3M17 6l2 2M14 9l2 2"/></>);
const Coins = I(<><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>);
const Car = I(<><path d="M3 13l2-5.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L21 13v5h-3v-2H6v2H3z"/><circle cx="7" cy="16" r="1.2"/><circle cx="17" cy="16" r="1.2"/></>);
const Refi = I(<><path d="M4 9a8 8 0 0 1 14-4l2 2M20 15a8 8 0 0 1-14 4l-2-2"/><path d="M17 3v4h-4M7 21v-4h4"/></>);
const Shield = I(<><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></>);
const Caravan = I(<><path d="M3 16V8a2 2 0 0 1 2-2h11l4 5v5h-3"/><circle cx="9" cy="16" r="2"/><path d="M11 16h3M3 16h2"/><rect x="6" y="9" width="4" height="3"/></>);
const Phone = I(<><path d="M5 4h3l1.5 5-2 1.5a11 11 0 0 0 5 5l1.5-2 5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z"/></>);
const Mail = I(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>);
const MapPin = I(<><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></>);
const Clock = I(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>);
const Star = (props) => (<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}><path d="M12 2.5l2.9 6 6.6.6-5 4.3 1.5 6.4L12 16.9 6 19.8l1.5-6.4-5-4.3 6.6-.6z"/></svg>);
const Check = I(<><path d="M5 12l4.5 4.5L19 7"/></>);
const ArrowRight = I(<><path d="M4 12h15M13 6l6 6-6 6"/></>);
const Menu = I(<><path d="M4 7h16M4 12h16M4 17h16"/></>);
const Close = I(<><path d="M6 6l12 12M18 6L6 18"/></>);
const ChevronDown = I(<><path d="M6 9l6 6 6-6"/></>);
const Quote = (props) => (<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}><path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H5a2 2 0 0 1 2-2h3V7zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-5a2 2 0 0 1 2-2h3V7z"/></svg>);
const Users = I(<><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 6a3 3 0 0 1 0 5M21 20c0-2.4-1.5-4.2-4-4.8"/></>);
const Facebook = (props)=>(<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}><path d="M14 9V7c0-1 .5-1.5 1.5-1.5H17V2.5h-2.5C12 2.5 10.5 4 10.5 6.5V9H8v3h2.5v9.5H14V12h2.4l.6-3H14z"/></svg>);
const Instagram = I(<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="0.6" fill="currentColor"/></>);
const Linkedin = (props)=>(<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}><path d="M6.5 8.5H4V20h2.5V8.5zM5.2 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM20 13.6c0-2.7-1.5-4-3.4-4-1.5 0-2.2.8-2.6 1.4V8.5H11.5V20H14v-6c0-1.3.6-2 1.6-2s1.4.8 1.4 2.1V20H20v-6.4z"/></svg>);

Object.assign(window, {
  MeshIcons: { Home, Building, Key, Coins, Car, Refi, Shield, Caravan, Phone, Mail, MapPin, Clock, Star, Check, ArrowRight, Menu, Close, ChevronDown, Quote, Users, Facebook, Instagram, Linkedin }
});
