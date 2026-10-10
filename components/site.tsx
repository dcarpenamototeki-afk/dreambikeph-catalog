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
  return <span className={`logo ${intro ? "intro-logo" : ""}`} aria-label="Dreambike PH"><Image src="/dreambike-mark-source.png" width={394} height={321} alt="" /><Image src="/dreambike-wordmark-source.png" width={556} height={115} alt="Dreambike PH" /></span>;
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

export function Home() { return <main><Intro /><Nav current="home" /><section className="hero"><div><p className="status"><b />Catalog preview</p><h1>Your next ride<br /><strong>starts here.</strong></h1><p>Browse available motorcycles, review the details, then message DreambikePH to verify your preferred unit.</p><Link className="yellow-button" href="/catalog">View available units ↓</Link></div></section><Footer /></main>; }

export function Catalog() {
  const [items, setItems] = useState<CatalogItem[]>([]); const [term, setTerm] = useState(""); const [selected, setSelected] = useState<CatalogItem | null>(null);
  useEffect(() => { fetch("/api/catalog").then((r) => r.json()).then((body) => setItems(body.data ?? [])).catch(() => setItems([])); }, []);
  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.brand} ${item.category}`.toLowerCase().includes(term.toLowerCase())), [items, term]);
  return <main><Nav current="catalog" /><section className="catalog"><div className="catalog-title"><div><p className="eyebrow">Available motorcycles</p><h1>Explore the<br />catalog.</h1></div><p>Availability changes quickly. Send us a message before visiting so our team can confirm the unit for you.</p></div><label className="search"><Search size={17} /><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search a brand, model, or type" /></label>{filtered.length ? <div className="grid">{filtered.map((item) => <article key={item.id}><div className="bike-image" style={{ backgroundImage: item.image_url ? `url("${item.image_url}")` : fallback }}><b>Available</b></div><div className="bike-body"><p>{item.brand || item.category}</p><h2>{item.title}</h2><span><CalendarDays size={13} /> {item.year_model || "Ask us"} <Gauge size={13} /> {item.odometer_km == null ? "Ask us" : `${item.odometer_km.toLocaleString("en-PH")} km`}</span><strong>{peso(item.cash_price)}</strong><button onClick={() => setSelected(item)}>View details <ArrowUpRight size={15} /></button></div></article>)}</div> : <div className="empty">No available units yet.<a href={messenger} target="_blank" rel="noreferrer">Message us for live inventory <ArrowUpRight size={15} /></a></div>}</section><Footer />{selected ? <Details item={selected} close={() => setSelected(null)} /> : null}</main>;
}

function Details({ item, close }: { item: CatalogItem; close: () => void }) { return <div className="modal-back" onMouseDown={close}><section className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}><X /></button><div className="modal-image" style={{ backgroundImage: item.image_url ? `url("${item.image_url}")` : fallback }} /><div><p className="eyebrow">{item.brand || item.category}</p><h2>{item.title}</h2><div className="detail-grid"><span>Year model<b>{item.year_model || "Ask us"}</b></span><span>Odometer<b>{item.odometer_km == null ? "Ask us" : `${item.odometer_km.toLocaleString("en-PH")} km`}</b></span></div><div className="price"><small>Cash price</small><b>{peso(item.cash_price)}</b></div><div className="swap"><small>Swapping value</small><b>{peso(item.swapping_value)}</b><p>Final swapping value is subject to unit assessment.</p></div><h3>Unit overview</h3><p>{item.condition_notes || "Message us for the complete condition notes and current photos."}</p><a className="yellow-button" href={messenger} target="_blank" rel="noreferrer"><MessageCircle size={16} />Send us a message</a></div></section></div>; }

export function Contact() { return <main><Nav current="contact" /><section className="contact"><p className="eyebrow">Get in touch</p><h1>Come see<br /><strong>your next ride.</strong></h1><p className="lead">Questions about a unit or a swap? Reach out directly and our team will help you confirm what is available.</p><div className="contact-grid"><a href={map} target="_blank" rel="noreferrer"><MapPin /><b>Visit the showroom</b><span>286 Honorio Lopez Blvd, Tondo, Manila City, 1013 Metro Manila</span><em>Open Waze / Google Maps <ArrowUpRight size={14} /></em></a><div><CalendarDays /><b>Showroom hours</b><span>Monday – Sunday<br />9:00am – 6:00pm</span></div><div><Phone /><b>Call or text us</b><span>Globe: 0945-871-3465<br />Smart: 0968-436-7252</span></div></div><div className="message"><MessageCircle /><div><p className="eyebrow">Fastest way to reach us</p><h2>Message us on Messenger.</h2></div><a href={messenger} target="_blank" rel="noreferrer">Open Messenger <ArrowUpRight size={15} /></a></div></section><Footer /></main>; }
