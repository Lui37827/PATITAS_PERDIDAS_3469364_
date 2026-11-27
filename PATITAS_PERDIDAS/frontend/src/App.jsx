import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Search, Heart, PawPrint, User, LogIn, ArrowRight, Star,
  CheckCircle2, MapPin, Calendar, Phone, Mail, X, Instagram,
  MessageCircle, TrendingUp, Home, AlertCircle, ShieldCheck,
  Menu, Newspaper, Info, BarChart2, Filter, Users, Coffee, KeyRound, LogOut, UserCircle, Camera,
  Upload, Image as ImageIcon, Edit, Trash2, Settings, FileText, Plus, RefreshCw,
  Ban, Eye, EyeOff, CreditCard, ChevronDown, Lock, UserX, UserCheck, IdCard,
  Building2, Globe, Facebook, Megaphone, HandHeart, BookOpen, Bookmark,
  Clock, Bell, CheckCheck, XCircle, Layers, Dog, Cat, Rabbit, ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Color palette (spec) ────────────────────────────────────────────────────
const BG       = "#F1F7F4";
const BG2      = "#E3F1EB";
const GREEN    = "#167A52";
const GREEN_D  = "#105C3E";
const TERRA    = "#C85C3A";
const TERRA_D  = "#A9472D";
const TEXT     = "#24332D";
const TEXT_S   = "#718078";
const BORDER   = "#D9E4DF";
const WHITE    = "#FFFFFF";
const ERR_BG   = "#FCE9E1";
const ERR_TEXT = "#A9472D";

// ─── Mock data ───────────────────────────────────────────────────────────────
const BOGOTA_LOCALIDADES = [
  "Usaquén","Chapinero","Santa Fe","San Cristóbal","Usme","Tunjuelito",
  "Bosa","Kennedy","Fontibón","Engativá","Suba","Barrios Unidos",
  "Teusaquillo","Los Mártires","Antonio Nariño","Puente Aranda",
  "La Candelaria","Rafael Uribe Uribe","Ciudad Bolívar","Sumapaz",
];

// Approximate geographic positions for Bogotá's localidades (% of container)
const LOC_MAP_POS = {
  "Suba":               { x: 24, y: 5  },
  "Usaquén":            { x: 70, y: 6  },
  "Engativá":           { x: 10, y: 26 },
  "Barrios Unidos":     { x: 46, y: 24 },
  "Chapinero":          { x: 72, y: 26 },
  "Fontibón":           { x: 4,  y: 42 },
  "Teusaquillo":        { x: 36, y: 40 },
  "Santa Fe":           { x: 64, y: 38 },
  "La Candelaria":      { x: 60, y: 48 },
  "Los Mártires":       { x: 42, y: 50 },
  "Puente Aranda":      { x: 22, y: 53 },
  "Antonio Nariño":     { x: 55, y: 60 },
  "Kennedy":            { x: 10, y: 65 },
  "San Cristóbal":      { x: 75, y: 62 },
  "Bosa":               { x: 4,  y: 77 },
  "Tunjuelito":         { x: 32, y: 72 },
  "Rafael Uribe Uribe": { x: 66, y: 74 },
  "Ciudad Bolívar":     { x: 18, y: 84 },
  "Usme":               { x: 56, y: 84 },
  "Sumapaz":            { x: 36, y: 95 },
};

const MAPA_DATA = {
  "Usaquén": 38, "Chapinero": 45, "Santa Fe": 21, "San Cristóbal": 29,
  "Usme": 18, "Tunjuelito": 24, "Bosa": 52, "Kennedy": 67,
  "Fontibón": 31, "Engativá": 48, "Suba": 74, "Barrios Unidos": 36,
  "Teusaquillo": 42, "Los Mártires": 19, "Antonio Nariño": 22,
  "Puente Aranda": 28, "La Candelaria": 15, "Rafael Uribe Uribe": 33,
  "Ciudad Bolívar": 57, "Sumapaz": 7,
};

const POSTS = [
  { id:"p1", type:"lost", title:"Golden Retriever Max", description:"Se perdió el 10 de enero, responde al nombre de Max. Muy amigable.", location:"Parque El Virrey, Chapinero", date:"2025-01-10", status:"active", species:"Perro", breed:"Golden Retriever", sex:"Macho", age:"3 años", distinctiveMarks:"Mancha blanca en el pecho", photo:"https://images.unsplash.com/photo-1714247084434-49bbc3ebf577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p2", type:"lost", title:"Gata persa Luna", description:"Gata persa de 3 años, ojos azules. Último avistamiento cerca del parque.", location:"Barrio Cedritos, Usaquén", date:"2025-01-18", status:"active", species:"Gato", breed:"Persa", sex:"Hembra", age:"3 años", photo:"https://images.unsplash.com/photo-1651777229167-abca200f3fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p3", type:"lost", title:"Labrador negro Rocky", description:"Perdido desde el 25 de enero. Tiene collar rojo con placa.", location:"Parque de la 93, Barrios Unidos", date:"2025-01-25", status:"active", species:"Perro", breed:"Labrador", sex:"Macho", age:"4 años", distinctiveMarks:"Collar rojo con placa de identificación", photo:"https://images.unsplash.com/photo-1630053905273-2dd2f41f0127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p4", type:"lost", title:"Gato siamés Mimi", description:"Se escapó por la ventana el 2 de febrero. Ojos azules, muy vocal.", location:"Chapinero Alto", date:"2025-02-02", status:"active", species:"Gato", breed:"Siamés", sex:"Hembra", age:"2 años", photo:"https://images.unsplash.com/photo-1771440184417-8d6e24b1eb99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p5", type:"lost", title:"Beagle tricolor Coco", description:"Se perdió en el parque. Muy asustadizo, no se acerca a extraños.", location:"Parque Simón Bolívar, Teusaquillo", date:"2025-02-14", status:"active", species:"Perro", breed:"Beagle", sex:"Macho", age:"5 años", distinctiveMarks:"Oreja derecha café oscuro", photo:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p6", type:"lost", title:"Schnauzer gris Dante", description:"Desapareció durante un corte de luz. Tiene chip de identificación.", location:"Barrio Niza, Suba", date:"2025-03-05", status:"active", species:"Perro", breed:"Schnauzer", sex:"Macho", age:"6 años", distinctiveMarks:"Microchip registrado", photo:"https://images.unsplash.com/photo-1619333774340-3a878585c2e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"p7", type:"lost", title:"Poodle blanco Canela", description:"Se escapó del jardín. Muy pequeña, pelo rizado, con moño rosado.", location:"Barrio Santa Bárbara, Usaquén", date:"2025-03-12", status:"found", species:"Perro", breed:"Poodle", sex:"Hembra", age:"2 años", photo:"https://images.unsplash.com/photo-1552575595-38bfbd75841a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  // Adopciones
  { id:"a1", type:"adoption", title:"Mestizo mediano Firulais", description:"Perro mestizo de 2 años, esterilizado y vacunado. Muy cariñoso, bueno con niños. Busca hogar amoroso.", location:"Barrios Unidos, Bogotá", date:"2025-04-01", status:"active", species:"Perro", breed:"Mestizo", sex:"Macho", age:"2 años", foundationId:"f1", accountType:"foundation", photo:"https://images.unsplash.com/photo-1604606363386-dd3f2357ad87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"a2", type:"adoption", title:"Gata tricolor adulta Lila", description:"Gata de 4 años, tranquila y limpia. Esterilizada. Ideal para apartamento.", location:"Teusaquillo, Bogotá", date:"2025-04-05", status:"active", species:"Gato", breed:"Doméstica", sex:"Hembra", age:"4 años", foundationId:"f2", accountType:"foundation", photo:"https://images.unsplash.com/photo-1786422208420-ed7971eb80ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"a3", type:"adoption", title:"Cachorro golden mix Toto", description:"Cachorro de 3 meses, vacunado, desparasitado. Familia responsable con espacio.", location:"Chapinero, Bogotá", date:"2025-04-10", status:"active", species:"Perro", breed:"Golden mix", sex:"Macho", age:"3 meses", accountType:"user", photo:"https://images.unsplash.com/photo-1716121250610-9268c9290c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"a4", type:"adoption", title:"Bulldog francés gris Pumba", description:"Bulldog francés de 1 año. Esterilizado, con todas sus vacunas. Muy tranquilo.", location:"Usaquén, Bogotá", date:"2025-05-12", status:"in-process", species:"Perro", breed:"Bulldog Francés", sex:"Macho", age:"1 año", foundationId:"f2", accountType:"foundation", photo:"https://images.unsplash.com/photo-1604606363386-dd3f2357ad87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id:"a5", type:"adoption", title:"Persa azul adulto Sultan", description:"Gato persa azul de 5 años. Muy tranquilo y cariñoso. Esterilizado.", location:"Suba, Bogotá", date:"2025-05-20", status:"adopted", species:"Gato", breed:"Persa", sex:"Macho", age:"5 años", foundationId:"f1", accountType:"foundation", photo:"https://images.unsplash.com/photo-1651777229167-abca200f3fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  // Eventos
  { id:"e1", type:"event", title:"Jornada de adopción — Parque El Virrey", description:"Ven este sábado al Parque El Virrey. Tendremos más de 30 mascotas en adopción, vacunación gratuita y chips de identificación.", location:"Parque El Virrey, Chapinero", date:"2025-04-20", status:"active", foundationId:"f1", accountType:"foundation", time:"09:00", photo:"https://images.unsplash.com/photo-1594004844563-536a03a6e532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
  { id:"e2", type:"event", title:"Campaña de esterilización gratuita Kennedy y Bosa", description:"Patitas Felices en alianza con la Alcaldía de Bogotá realizará jornadas de esterilización gratuita.", location:"Kennedy y Bosa, Bogotá", date:"2025-05-03", status:"active", foundationId:"f1", accountType:"foundation", time:"08:00", photo:"https://images.unsplash.com/photo-1569285105724-89e18c990b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
  { id:"e3", type:"event", title:"Taller: Tenencia responsable de mascotas", description:"Aprende sobre nutrición, salud preventiva y bienestar animal. Cupos limitados, inscripción gratuita.", location:"Biblioteca El Tintal, Kennedy", date:"2025-05-17", status:"active", foundationId:"f2", accountType:"foundation", time:"10:00", photo:"https://images.unsplash.com/photo-1703733569670-f36996a8ca1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
  { id:"e4", type:"event", title:"Festival Patitas Felices 2025", description:"Gran festival anual con adopciones, concursos, charlas y mucho más. Entrada gratuita.", location:"Parque Simón Bolívar, Teusaquillo", date:"2025-06-01", status:"cancelled", foundationId:"f1", accountType:"foundation", time:"09:00", photo:"https://images.unsplash.com/photo-1594004844563-536a03a6e532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
];

const MOCK_USERS = [
  { firstName:"María", lastName:"González", alias:"Mago", birthDate:"1990-04-12", docType:"CC", docNumber:"1020567890", email:"maria@ejemplo.com", password:"demo1234", phone:"+57 301 555 1111", locality:"Chapinero", status:"active", createdAt:"2025-01-15" },
  { firstName:"Carlos", lastName:"Ramírez", alias:"Caro", birthDate:"1985-08-23", docType:"CC", docNumber:"80578901", email:"carlos@ejemplo.com", password:"carlos123", phone:"+57 310 555 2222", locality:"Suba", status:"active", createdAt:"2025-02-03" },
  { firstName:"Ana", lastName:"López", alias:"Ani", birthDate:"1998-11-07", docType:"CC", docNumber:"1019589012", email:"ana@ejemplo.com", password:"ana123", phone:"+57 320 555 3333", locality:"Usaquén", status:"suspended", createdAt:"2025-02-20" },
];

const MOCK_FOUNDATIONS = [
  {
    id: "f0", name: "Patitas Felices Bogotá", type: "Rescate y adopción",
    responsible: "Laura Sánchez", nit: "900111222-0", email: "patitasfelices@ejemplo.com", password: "fund123",
    phone: "+57 315 800 0000", locality: "Chapinero",
    description: "Fundación demo de Patitas Perdidas. Dedicada al rescate, rehabilitación y adopción responsable de mascotas en Bogotá.",
    mission: "Brindar una segunda oportunidad a cada animal rescatado, conectándolo con familias amorosas y responsables.",
    vision: "Un Bogotá libre de abandono animal, donde cada mascota tiene un hogar.",
    address: "Chapinero, Bogotá D.C.",
    instagram: "@patitasfelices", facebook: "PatitasFelicesBog", website: "patitasfelices.ejemplo.com",
    status: "active", createdAt: "2020-01-15",
  },
  {
    id: "f1", name: "Fundación Alma Perruna", type: "Esterilización y rescate",
    responsible: "Carolina García", nit: "900234567-1", email: "info@almaperruna.org", password: "fund123",
    phone: "+57 320 449 6445", locality: "Suba",
    description: "Fundación sin ánimo de lucro nacida en 2015, dedicada a jornadas de esterilización masiva y rescate de perros y gatos callejeros en los barrios más vulnerables de Bogotá.",
    mission: "Transformar la sensibilidad de los corazones humanos para reducir el abandono animal y los nacimientos descontrolados mediante la esterilización como único camino.",
    vision: "Un Bogotá donde ningún animal sufra abandono ni reproducciones descontroladas, con comunidades educadas en tenencia responsable.",
    address: "Bogotá D.C. (cobertura Suba, Engativá y Ciudad Bolívar)",
    instagram: "@almaperruna", facebook: "FundacionAlmaPerruna", website: "almaperruna.org",
    status: "active", createdAt: "2015-07-24",
  },
  {
    id: "f2", name: "Huellitas Sin Hogar", type: "Adopción y apadrinamiento",
    responsible: "Equipo Huellitas", nit: "900345678-2", email: "huellitas.social@gmail.com", password: "fund456",
    phone: "+57 311 350 0168", locality: "Barrios Unidos",
    description: "Grupo voluntario que conecta animales abandonados en Bogotá con familias responsables. Plataforma líder de adopción y apadrinamiento con más de 15.900 seguidores en redes.",
    mission: "Conectar animales abandonados con familias responsables que les brinden un hogar permanente y lleno de amor en Bogotá y toda Colombia.",
    vision: "Una Bogotá donde cada animal callejero encuentre un hogar digno y permanente.",
    address: "Avenida Caracas # 55-17, Bogotá D.C.",
    instagram: "@huellitas.social", website: "huellitas.social",
    status: "active", createdAt: "2018-03-10",
  },
  {
    id: "f3", name: "Fundación Razas Únicas", type: "Rescate y adopción responsable",
    responsible: "Equipo Razas Únicas", nit: "900456789-3", email: "razasunicas@gmail.com", password: "fund789",
    phone: "+57 319 247 1822", locality: "Usaquén",
    description: "Rescatan, rehabilitan y facilitan adopciones responsables de perros de raza en abandono o maltrato. El proceso incluye formulario, entrevista familiar y visita domiciliaria.",
    mission: "Rescatar, rehabilitar y generar procesos de adopción responsable, promoviendo la tenencia responsable desde el ejemplo y la educación.",
    vision: "Un país donde los animales de todas las razas sean valorados y protegidos sin importar su origen o condición.",
    address: "Vereda Las Flores, Guasca, Cundinamarca (atención adopciones Bogotá)",
    instagram: "@razasunicas", facebook: "razasunicas", website: "fundacionrazasunicas.org",
    status: "active", createdAt: "2016-05-12",
  },
  {
    id: "f4", name: "Fundación Rayito de Luna", type: "Refugio y rescate temporal",
    responsible: "Voluntarios Rayito de Luna", nit: "900567890-4", email: "rayitodelunabog@gmail.com", password: "fund000",
    phone: "+57 300 123 4567", locality: "Chapinero",
    description: "Fundación voluntaria que rescata animales callejeros en vulnerabilidad, brindando refugio temporal, atención veterinaria y acompañamiento hasta encontrar hogar adoptivo.",
    mission: "Rescatar y brindar refugio temporal a animales en situación de calle hasta encontrarles un hogar definitivo, amoroso y responsable.",
    vision: "Que cada patita rescatada encuentre su propio Rayito de Luna: un hogar lleno de amor y cuidados.",
    address: "Chapinero, Bogotá D.C.",
    instagram: "@rayitodelunabog",
    status: "active", createdAt: "2019-11-01",
  },
];

const DEMO = { email: "maria@ejemplo.com", password: "demo1234" };
const ADMIN_CRED = { email: "admin@patitasperdidas.com", password: "admin2024" };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcAge(birthDate) {
  const b = new Date(birthDate); const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (t.getMonth() - b.getMonth() < 0 || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
  return age;
}

const statusLabel = {
  active:"Activa", pending:"Pendiente", suspended:"Suspendida",
  found:"Encontrada", adopted:"Adoptada", "in-process":"En proceso",
  cancelled:"Cancelado", reviewing:"En revisión",
};
const statusColor = {
  active: GREEN, found: GREEN, adopted: GREEN,
  "in-process": "#D97706", pending: "#D97706", reviewing: "#D97706",
  suspended: TERRA_D, cancelled: TERRA_D,
};

// ─── Reusable UI ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${statusColor[status] || "#718078"}18`, color: statusColor[status] || "#718078" }}>
      {statusLabel[status] || status}
    </span>
  );
}

function SpeciesIcon({ species }) {
  const s = (species || "").toLowerCase();
  if (s.includes("gato")) return <Cat className="w-4 h-4" />;
  if (s.includes("conejo")) return <Rabbit className="w-4 h-4" />;
  return <Dog className="w-4 h-4" />;
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: `${TEXT}55` }}>{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input type={type} value={value} disabled={disabled} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-3 rounded-xl text-sm focus:outline-none transition-all"
      style={{ border: `1.5px solid ${BORDER}`, backgroundColor: WHITE, color: TEXT, opacity: disabled ? 0.6 : 1 }} />
  );
}

function Btn({ children, onClick, color = GREEN, outlined = false, small = false, full = false, type = "button" }) {
  return (
    <button type={type} onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95 ${full ? "w-full" : ""} ${small ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"}`}
      style={outlined
        ? { border: `1.5px solid ${color}`, color: color, backgroundColor: "transparent" }
        : { backgroundColor: color, color: WHITE }}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm ${className}`} style={{ border: `1px solid ${BORDER}` }}>
      {children}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BG2 }}>
        <span style={{ color: GREEN }}>{icon}</span>
      </div>
      <p className="font-semibold mb-1" style={{ color: TEXT }}>{title}</p>
      <p className="text-sm" style={{ color: TEXT_S }}>{desc}</p>
    </div>
  );
}

// ─── Pet Card ─────────────────────────────────────────────────────────────────
function PetCard({ post, onOpen, onFavorite, isFavorited, onContact, fnd }) {
  const isAdoption = post.type === "adoption";
  const isLost     = post.type === "lost";
  const accent     = isAdoption ? GREEN : TERRA;

  return (
    <motion.div whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={{ borderRadius: 20 }}>
      <Card className="overflow-hidden h-full flex flex-col">

        {/* ── Photo area ── */}
        <div className="relative shrink-0" style={{ height: 192, backgroundColor: BG2 }}>
          {post.photo
            ? <img src={post.photo} className="w-full h-full object-cover" alt={post.title} />
            : <div className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(140deg, ${accent}22 0%, ${accent}09 100%)` }}>
                <span style={{ color: accent, opacity: 0.35, transform: "scale(2.5)" }}><SpeciesIcon species={post.species} /></span>
              </div>
          }
          {/* Gradient veil */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 52%)" }} />

          {/* ── EN ADOPCIÓN pill (adoption only) ── */}
          {isAdoption && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
                style={{ backgroundColor: GREEN, color: WHITE, boxShadow: "0 2px 8px rgba(22,122,82,0.5)" }}>
                <HandHeart style={{ width: 11, height: 11 }} />EN ADOPCIÓN
              </span>
            </div>
          )}
          {/* ── Status badge (lost/found) ── */}
          {!isAdoption && (
            <div className="absolute top-3 left-3"><Badge status={post.status} /></div>
          )}

          {/* ── Favorite button ── */}
          {onFavorite && (
            <button onClick={e => { e.stopPropagation(); onFavorite(); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "rgba(0,0,0,0.38)", backdropFilter: "blur(6px)" }}>
              <Heart style={{ width: 15, height: 15 }} fill={isFavorited ? "#f87171" : "none"} color={isFavorited ? "#f87171" : WHITE} />
            </button>
          )}

          {/* ── Foundation watermark (adoption) ── */}
          {isAdoption && fnd && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
              <Building2 style={{ width: 11, height: 11, color: "rgba(255,255,255,0.75)" }} />
              <span className="text-xs font-medium truncate" style={{ color: WHITE, maxWidth: 130 }}>{fnd.name}</span>
            </div>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title + species */}
          <div>
            {post.species && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1.5"
                style={{ backgroundColor: BG2, color: GREEN_D }}>
                <SpeciesIcon species={post.species} />
                {post.species}{post.breed ? ` · ${post.breed}` : ""}
              </span>
            )}
            <h3 className="font-bold text-sm leading-snug" style={{ color: TEXT, fontFamily: "'Fraunces', serif" }}>{post.title}</h3>
            {/* Age / Sex (adoption) */}
            {isAdoption && (post.sex || post.age) && (
              <p className="text-xs mt-1" style={{ color: TEXT_S }}>
                {[post.sex, post.age].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {/* Location + date */}
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: TEXT_S }}>
              <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />{post.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: TEXT_S }}>
              <Calendar style={{ width: 12, height: 12, flexShrink: 0 }} />{post.date}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {onOpen && (
              <button onClick={onOpen}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: accent, color: WHITE }}>
                {isAdoption ? "Solicitar adopción" : "Ver reporte"}
              </button>
            )}
            {isLost && onContact && (
              <button onClick={onContact}
                className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                style={{ backgroundColor: `${GREEN}14`, color: GREEN }}>
                <Bell style={{ width: 13, height: 13 }} />Informar avistamiento
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EventCard({ post, foundations, onOpen }) {
  const fnd = foundations.find(f => f.id === post.foundationId);
  const isCancelled = post.status === "cancelled";
  const posterGradient = isCancelled
    ? "linear-gradient(135deg, #6b7280 0%, #374151 100%)"
    : `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_D} 100%)`;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="overflow-hidden">
        {/* Poster area */}
        <div className="relative" style={{ height: 200 }}>
          {post.photo ? (
            <img src={post.photo} className="w-full h-full object-cover" alt={post.title} />
          ) : (
            <div className="w-full h-full" style={{ background: posterGradient }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)" }} />
          {/* Date badge top-right */}
          {post.date && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ backgroundColor: "rgba(0,0,0,0.45)", color: WHITE, backdropFilter: "blur(6px)" }}>
              {post.date}{post.time ? ` · ${post.time}` : ""}
            </div>
          )}
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <h3 className="font-bold text-sm text-white leading-snug mb-1" style={{ fontFamily: "'Fraunces', serif", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{post.title}</h3>
            {fnd && <p className="text-xs text-white" style={{ opacity: 0.8 }}>{fnd.name}</p>}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge status={post.status} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs mb-3" style={{ color: TEXT_S }}>
            {fnd && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{fnd.name}</span>}
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{post.location}</span>
          </div>
          {onOpen && (
            <button onClick={onOpen}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: isCancelled ? TEXT_S : GREEN }}>
              Ver evento
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function FoundationCard({ fnd, onFavorite, isFavorited }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BG2 }}>
            {fnd.logo ? <img src={fnd.logo} className="w-full h-full object-cover rounded-xl" alt="" />
              : <Building2 className="w-6 h-6" style={{ color: GREEN }} />}
          </div>
          {onFavorite && (
            <button onClick={onFavorite} className="transition-all hover:scale-110">
              <Bookmark className="w-4.5 h-4.5" fill={isFavorited ? GREEN : "none"} style={{ color: isFavorited ? GREEN : TEXT_S, width: 18, height: 18 }} />
            </button>
          )}
        </div>
        <Badge status={fnd.status} />
        <h3 className="font-bold text-sm mt-2 mb-1" style={{ color: TEXT }}>{fnd.name}</h3>
        <p className="text-xs mb-1" style={{ color: TEXT_S }}>{fnd.type}</p>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: TEXT_S }}>{fnd.description}</p>
        <span className="flex items-center gap-1 text-xs" style={{ color: TEXT_S }}>
          <MapPin className="w-3.5 h-3.5" />{fnd.locality}
        </span>
      </Card>
    </motion.div>
  );
}

function PetDetailModal({ post, foundations, onClose, onAdopt }) {
  const isAdoption = post.type === "adoption";
  const accentColor = isAdoption ? GREEN : TERRA;
  const fnd = foundations.find(f => f.id === post.foundationId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto"
        style={{ backgroundColor: WHITE, maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>
        {/* Photo */}
        <div className="relative" style={{ height: 300, backgroundColor: BG2 }}>
          {post.photo
            ? <img src={post.photo} className="w-full h-full object-cover" alt={post.title} />
            : <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` }}>
                <span style={{ color: accentColor, opacity: 0.4 }}><SpeciesIcon species={post.species} /></span>
              </div>
          }
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: WHITE }}>
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge status={post.status} />
              {post.species && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: WHITE }}>
                  {post.species}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: "'Fraunces', serif", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{post.title}</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Details grid */}
          {(post.breed || post.sex || post.age || post.distinctiveMarks) && (
            <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-2xl" style={{ backgroundColor: BG }}>
              {post.breed && <div><p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: TEXT_S }}>Raza</p><p className="text-sm font-medium" style={{ color: TEXT }}>{post.breed}</p></div>}
              {post.sex && <div><p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: TEXT_S }}>Sexo</p><p className="text-sm font-medium" style={{ color: TEXT }}>{post.sex}</p></div>}
              {post.age && <div><p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: TEXT_S }}>Edad</p><p className="text-sm font-medium" style={{ color: TEXT }}>{post.age}</p></div>}
              {post.distinctiveMarks && <div className="col-span-2"><p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: TEXT_S }}>Señas particulares</p><p className="text-sm font-medium" style={{ color: TEXT }}>{post.distinctiveMarks}</p></div>}
            </div>
          )}

          <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_S }}>{post.description}</p>

          <div className="flex flex-col gap-1.5 mb-5">
            <span className="flex items-center gap-2 text-sm" style={{ color: TEXT_S }}>
              <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />{post.location}
            </span>
            <span className="flex items-center gap-2 text-sm" style={{ color: TEXT_S }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: accentColor }} />{post.date}
            </span>
          </div>

          {isAdoption && fnd && (
            <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{ backgroundColor: BG2 }}>
              <Building2 className="w-5 h-5 shrink-0" style={{ color: GREEN }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: GREEN_D }}>{fnd.name}</p>
                {fnd.phone && <p className="text-xs" style={{ color: TEXT_S }}>{fnd.phone}</p>}
              </div>
            </div>
          )}

          {isAdoption && (
            <button onClick={() => { onClose(); onAdopt?.(); }}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ backgroundColor: GREEN, boxShadow: `0 4px 16px ${GREEN}40` }}>
              Solicitar adopción →
            </button>
          )}
          {!isAdoption && (
            <div className="flex flex-col gap-2">
              <button onClick={onClose}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: TERRA }}>
                Informé que la vi
              </button>
              {post.contact && (
                <p className="text-xs text-center" style={{ color: TEXT_S }}>Contacto: {post.contact}</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function EventDetailModal({ post, foundations, onClose }) {
  const fnd = foundations.find(f => f.id === post.foundationId);
  const isCancelled = post.status === "cancelled";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: WHITE, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        {/* Event poster */}
        <div className="relative" style={{ height: 300 }}>
          {post.photo ? (
            <img src={post.photo} className="w-full h-full object-cover" alt={post.title} />
          ) : (
            <div className="w-full h-full" style={{ background: isCancelled ? `linear-gradient(135deg, #6b7280, #374151)` : `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_D} 100%)` }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: WHITE }}>
            <X className="w-4 h-4" />
          </button>
          {/* Date badge */}
          {post.date && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: WHITE, backdropFilter: "blur(8px)" }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1" />{post.date}{post.time ? ` · ${post.time}` : ""}
            </div>
          )}
          {/* Poster content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <Badge status={post.status} />
            <h2 className="text-2xl font-bold text-white mt-2 leading-tight" style={{ fontFamily: "'Fraunces', serif", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>{post.title}</h2>
            {fnd && <p className="text-sm text-white mt-1" style={{ opacity: 0.85 }}>{fnd.name}</p>}
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed mb-5" style={{ color: TEXT_S }}>{post.description}</p>

          <div className="flex flex-col gap-2 mb-5">
            <span className="flex items-center gap-2 text-sm" style={{ color: TEXT_S }}>
              <MapPin className="w-4 h-4 shrink-0" style={{ color: GREEN }} />{post.location}
            </span>
            <span className="flex items-center gap-2 text-sm" style={{ color: TEXT_S }}>
              <Calendar className="w-4 h-4 shrink-0" style={{ color: GREEN }} />{post.date}{post.time ? ` a las ${post.time}` : ""}
            </span>
          </div>

          {fnd && (
            <div className="p-4 rounded-2xl mb-5" style={{ backgroundColor: BG2 }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GREEN_D }}>Organizador</p>
              <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>{fnd.name}</p>
              {fnd.phone && <p className="text-xs flex items-center gap-1.5 mb-1" style={{ color: TEXT_S }}><Phone className="w-3.5 h-3.5" />{fnd.phone}</p>}
              {fnd.instagram && <p className="text-xs flex items-center gap-1.5" style={{ color: TEXT_S }}><Instagram className="w-3.5 h-3.5" />{fnd.instagram}</p>}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90"
              style={{ border: `1.5px solid ${GREEN}`, color: GREEN, backgroundColor: WHITE }}>
              Compartir evento
            </button>
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: isCancelled ? TEXT_S : GREEN }}>
              {isCancelled ? "Cancelado" : "Me interesa"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}