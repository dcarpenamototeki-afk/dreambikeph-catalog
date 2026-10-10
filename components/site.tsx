"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Gauge, MapPin, MessageCircle, Phone, Search, X } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { peso } from "@/lib/catalog";

const messenger = "https://m.me/302557126279943";
const map = "https://maps.app.goo.gl/AMSyAYcyzv1Yod2W8";

function Logo({ intro = false }: { intro?: boolean }) {
  return <span className={`logo ${intro ? "intro-logo" : ""}`} aria-label="Dreambike PH"><Image style={{ filter: "none", mixBlendMode: "normal" }} src="/dreambike-mark-white.png" width={394} height={321} alt="" /><Image style={{ filter: "none", mixBlendMode: "normal" }} src="/dreambike-wordmark-white.png" width={556} height={115} alt="Dreambike PH" /></span>;
}

function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setShow(false), 2200); return () => clearTimeout(timer); }, []);
  return show ? <div className="intro"><i /><div><Logo intro /><p>YOUR NEXT RIDE AWAITS</p></div></div> : null;
}

function Nav({ current }: { current: "home" | "catalog" | "contact" }) {
  return <header><Link href="/" className="brand"><Logo /></Link><nav><Link className={current === "home" ? "active" : ""} href="/">Home</Link><Link className={current === "catalog" ? "active" : ""} href="/catalog">Catalog</Link><Link className={current === "contact" ? "active" : ""} href="/contact">Contact us</Link><a className="checker" href="https://dreambike-tracker.onrender.com/" target="_blank" rel="noreferrer">ORCR / Plate checker <ArrowUpRight size={14} /></a><Link className="admin-link" href="/login?next=%2Fadmin">Admin access</Link></nav></header>;
}

function Footer() { return <footer><Logo /><span>Pre-owned motorcycles, direct service, and a ride worth remembering.</span><a href={messenger} target="_blank" rel="noreferrer">Message DreambikePH <ArrowUpRight size={15} /></a></footer>; }
const fallback = "url('/dreambike-hero-clean.png')";
const galleryStyles = `
  .gallery-modal { grid-template-columns: minmax(0, 1.25fr) minmax(350px, .75fr); }.gallery-stack { min-width: 0; padding: 32px 20px 24px; }.gallery-stage { position: relative; min-height: 460px; overflow: hidden; border: 1px solid #ffffff24; border-radius: 7px; display: grid; place-items: center; background: #17191d; }.gallery-blur { position: absolute; inset: -28px; background: center / cover; filter: blur(22px) brightness(.52); opacity: .8; }.gallery-stage img { position: relative; z-index: 1; width: 100%; height: 460px; object-fit: contain; }.gallery-control { position: absolute; z-index: 2; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border: 0; border-radius: 50%; background: #111c; color: #fff; cursor: pointer; font-size: 24px; }.gallery-control.prev { left: 12px; }.gallery-control.next { right: 12px; }.gallery-thumbs { display: flex; gap: 9px; overflow-x: auto; padding: 15px 4px 2px; }.gallery-thumbs button { flex: 0 0 66px; height: 66px; padding: 0; border: 2px solid transparent; border-radius: 7px; overflow: hidden; background: #25272b; cursor: pointer; }.gallery-thumbs button.active { border-color: #ffc400; }.gallery-thumbs img { width: 100%; height: 100%; object-fit: cover; }.gallery-modal > div:last-child { padding: 42px 35px; } @media(max-width:900px) { .gallery-modal { grid-template-columns: 1fr; }.gallery-stack { padding: 20px; }.gallery-stage, .gallery-stage img { min-height: 300px; height: min(62vh, 460px); } } @media(max-width:620px) { .gallery-stage, .gallery-stage img { min-height: 230px; height: 50vh; } }
`;

export function Home() { return <main><Intro /><Nav current="home" /><section className="hero"><div><p className="status"><b />Catalog preview</p><h1>Your next ride<br /><strong>starts here.</strong></h1><p>Browse available motorcycles, review the details, then message DreambikePH to verify your preferred unit.</p><Link className="yellow-button" href="/catalog">View available units ↓</Link></div></section><Footer /></main>; }

export function Catalog() {
  const [items, setItems] = useState<CatalogItem[]>([]); const [term, setTerm] = useState(""); const [selected, setSelected] = useState<CatalogItem | null>(null);
  useEffect(() => { fetch("/api/catalog").then((r) => r.json()).then((body) => setItems(body.data ?? [])).catch(() => setItems([])); }, []);
  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.brand} ${item.category}`.toLowerCase().includes(term.toLowerCase())), [items, term]);
  return <main><Nav current="catalog" /><section className="catalog"><div className="catalog-title"><div><p className="eyebrow">Available motorcycles</p><h1>Explore the<br />catalog.</h1></div><p>Availability changes quickly. Send us a message before visiting so our team can confirm the unit for you.</p></div><label className="search"><Search size={17} /><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search a brand, model, or type" /></label>{filtered.length ? <div className="grid">{filtered.map((item) => <article key={item.id}><div className="bike-image" style={{ backgroundImage: item.image_urls?.[0] || item.image_url ? `url("${item.image_urls?.[0] || item.image_url}")` : fallback }}><b>Available</b></div><div className="bike-body"><p>{item.brand || item.category}</p><h2>{item.title}</h2><span><CalendarDays size={13} /> {item.year_model || "Ask us"} <Gauge size={13} /> {item.odometer_km == null ? "Ask us" : `${item.odometer_km.toLocaleString("en-PH")} km`}</span><strong>{peso(item.cash_price)}</strong><button onClick={() => setSelected(item)}>View details <ArrowUpRight size={15} /></button></div></article>)}</div> : <div className="empty">No available units yet.<a href={messenger} target="_blank" rel="noreferrer">Message us for live inventory <ArrowUpRight size={15} /></a></div>}</section><Footer />{selected ? <Details item={selected} close={() => setSelected(null)} /> : null}</main>;
}

function Details({ item, close }: { item: CatalogItem; close: () => void }) {
  const photos = item.image_urls?.length ? item.image_urls : item.image_url ? [item.image_url] : [];
  const [active, setActive] = useState(0); const photo = photos[active] ?? "/dreambike-hero-clean.png";
  const move = (direction: number) => setActive((current) => (current + direction + photos.length) % photos.length);
  return <div className="modal-back" onMouseDown={close}><style>{galleryStyles}</style><section className="modal gallery-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}><X /></button><div className="gallery-stack"><div className="gallery-stage"><div className="gallery-blur" style={{ backgroundImage: `url("${photo}")` }} /><img src={photo} alt={`${item.title} photo ${active + 1}`} />{photos.length > 1 && <><button className="gallery-control prev" onClick={() => move(-1)} aria-label="Previous photo">‹</button><button className="gallery-control next" onClick={() => move(1)} aria-label="Next photo">›</button></>}</div>{photos.length > 1 && <div className="gallery-thumbs">{photos.map((url, index) => <button className={index === active ? "active" : ""} onClick={() => setActive(index)} key={url} aria-label={`View photo ${index + 1}`}><img src={url} alt="" /></button>)}</div>}</div><div><p className="eyebrow">{item.brand || item.category}</p><h2>{item.title}</h2><div className="detail-grid"><span>Year model<b>{item.year_model || "Ask us"}</b></span><span>Odometer<b>{item.odometer_km == null ? "Ask us" : `${item.odometer_km.toLocaleString("en-PH")} km`}</b></span></div><div className="price"><small>Cash price</small><b>{peso(item.cash_price)}</b></div><div className="swap"><small>{item.is_cash_only ? "Payment option" : "Swapping value"}</small><b>{item.is_cash_only ? "Cash only" : peso(item.swapping_value)}</b>{!item.is_cash_only && <p>Final swapping value is subject to unit assessment.</p>}</div><h3>Unit description</h3><p>{item.condition_notes || "Message us for the complete unit description and current photos."}</p><a className="yellow-button" href={messenger} target="_blank" rel="noreferrer"><MessageCircle size={16} />Send us a message</a></div></section></div>;
}

export function Contact() { return <main><Nav current="contact" /><section className="contact"><p className="eyebrow">Get in touch</p><h1>Come see<br /><strong>your next ride.</strong></h1><p className="lead">Questions about a unit or a swap? Reach out directly and our team will help you confirm what is available.</p><div className="contact-grid"><a href={map} target="_blank" rel="noreferrer"><MapPin /><b>Visit the showroom</b><span>286 Honorio Lopez Blvd, Tondo, Manila City, 1013 Metro Manila</span><em>Open Waze / Google Maps <ArrowUpRight size={14} /></em></a><div><CalendarDays /><b>Showroom hours</b><span>Monday – Sunday<br />9:00am – 6:00pm</span></div><div><Phone /><b>Call or text us</b><span>Globe: 0945-871-3465<br />Smart: 0968-436-7252</span></div></div><div className="message"><MessageCircle /><div><p className="eyebrow">Fastest way to reach us</p><h2>Message us on Messenger.</h2></div><a href={messenger} target="_blank" rel="noreferrer">Open Messenger <ArrowUpRight size={15} /></a></div></section><Footer /></main>; }
