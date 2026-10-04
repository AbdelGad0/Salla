/* Salla Mobiles theme - storefront logic (Twilight SDK compatible + localStorage demo) */

const PRODUCTS = [
  { id: "iphone15", ar: "آيفون 15 برو 256GB", en: "iPhone 15 Pro 256GB", price: 5299, img: "src/assets/images/iphone-14.jpg", tag_ar: "الأكثر مبيعاً", tag_en: "Best seller" },
  { id: "samsung24", ar: "سامسونج S24 ألترا", en: "Samsung S24 Ultra", price: 4799, img: "src/assets/images/samsung-s23.jpg", tag_ar: "جديد", tag_en: "New" },
  { id: "pixel8", ar: "جوجل بيكسل 8 برو", en: "Google Pixel 8 Pro", price: 3599, img: "src/assets/images/pixel-7.jpg", tag_ar: "خصم 15%", tag_en: "15% off" },
  { id: "iphonex", ar: "آيفون 13 — مجدد معتمد", en: "iPhone 13 — Certified renewed", price: 2499, img: "src/assets/images/iphone-13blue.jpg", tag_ar: "توفير", tag_en: "Save" },
  { id: "buds", ar: "سماعات لاسلكية برو", en: "Wireless Buds Pro", price: 549, img: "src/assets/images/earbuds.jpg", tag_ar: "إكسسوار", tag_en: "Accessory" },
  { id: "watch", ar: "ساعة ذكية ألترا", en: "Smart Watch Ultra", price: 1499, img: "src/assets/images/smartwatch.jpg", tag_ar: "جديد", tag_en: "New" }
];

const state = {
  lang: localStorage.getItem("sm-lang") || "ar",
  cart: JSON.parse(localStorage.getItem("sm-cart") || "[]")
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function save() {
  localStorage.setItem("sm-cart", JSON.stringify(state.cart));
  localStorage.setItem("sm-lang", state.lang);
}

function money(n) {
  return state.lang === "ar" ? `${n.toLocaleString("ar-EG")} ر.س` : `${n.toLocaleString("en-US")} SAR`;
}

/* ---- products grid ---- */
function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card-hover bg-white rounded-2xl border overflow-hidden flex flex-col">
      <div class="relative">
        <img src="${p.img}" alt="${state.lang === "ar" ? p.ar : p.en}" loading="lazy" class="h-52 w-full object-cover" />
        <span class="absolute top-3 start-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">${state.lang === "ar" ? p.tag_ar : p.tag_en}</span>
      </div>
      <div class="p-4 flex flex-col gap-2 flex-1">
        <h3 class="font-bold">${state.lang === "ar" ? p.ar : p.en}</h3>
        <p class="text-green-700 font-extrabold text-lg">${money(p.price)}</p>
        <button data-add="${p.id}" class="mt-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl" data-ar="أضف للسلة" data-en="Add to cart">${state.lang === "ar" ? "أضف للسلة" : "Add to cart"}</button>
      </div>
    </div>`).join("");
}

/* ---- cart ---- */
function cartCount() { return state.cart.reduce((a, c) => a + c.qty, 0); }
function cartTotal() { return state.cart.reduce((a, c) => a + c.qty * PRODUCTS.find(p => p.id === c.id).price, 0); }

function renderCart() {
  const box = $("#cart-items");
  const count = $("#cart-count");
  if (count) count.textContent = cartCount();
  const total = $("#cart-total");
  if (total) total.textContent = money(cartTotal());
  if (!box) return;
  if (!state.cart.length) {
    box.innerHTML = `<p class="text-gray-500 text-center py-8" data-ar="سلتك فارغة — اكتشف أحدث الموبايلات" data-en="Your cart is empty — discover the latest phones">${state.lang === "ar" ? "سلتك فارغة — اكتشف أحدث الموبايلات" : "Your cart is empty — discover the latest phones"}</p>`;
    return;
  }
  box.innerHTML = state.cart.map(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return `<div class="flex gap-3 items-center border rounded-xl p-2">
      <img src="${p.img}" class="w-16 h-16 rounded-lg object-cover" alt="" />
      <div class="flex-1">
        <p class="font-bold text-sm">${state.lang === "ar" ? p.ar : p.en}</p>
        <p class="text-green-700 font-bold text-sm">${money(p.price)}</p>
        <div class="flex items-center gap-2 mt-1">
          <button data-dec="${p.id}" class="w-7 h-7 rounded-full border font-bold">−</button>
          <span class="font-bold">${c.qty}</span>
          <button data-inc="${p.id}" class="w-7 h-7 rounded-full border font-bold">+</button>
        </div>
      </div>
      <button data-del="${p.id}" class="text-red-500 px-2">✕</button>
    </div>`;
  }).join("");
}

function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function addToCart(id) {
  const row = state.cart.find(c => c.id === id);
  if (row) row.qty++;
  else state.cart.push({ id, qty: 1 });
  save(); renderCart();
  // Twilight SDK hook (يعمل تلقائياً داخل سلة عند التركيب)
  if (window.salla?.cart?.addItem) { try { window.salla.cart.addItem({ id, quantity: 1 }); } catch (e) {} }
  toast(state.lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
}

/* ---- i18n ---- */
async function applyLang() {
  const dict = await fetch(`src/locales/${state.lang}.json`).then(r => r.json()).catch(() => null);
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  if (dict) {
    $$("[data-i18n]").forEach(el => {
      const v = el.dataset.i18n.split(".").reduce((o, k) => o?.[k], dict);
      if (v) el.textContent = v;
    });
  } else {
    $$("[data-ar]").forEach(el => { el.textContent = el.dataset[state.lang]; });
  }
  const t = $("#lang-btn");
  if (t) t.textContent = state.lang === "ar" ? "EN" : "عربي";
  renderProducts(); renderCart(); save();
}

/* ---- events ---- */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(add.dataset.add);
  const inc = e.target.closest("[data-inc]");
  if (inc) { state.cart.find(c => c.id === inc.dataset.inc).qty++; save(); return renderCart(); }
  const dec = e.target.closest("[data-dec]");
  if (dec) {
    const r = state.cart.find(c => c.id === dec.dataset.dec);
    r.qty--; if (r.qty <= 0) state.cart = state.cart.filter(c => c.id !== r.id);
    save(); return renderCart();
  }
  const del = e.target.closest("[data-del]");
  if (del) { state.cart = state.cart.filter(c => c.id !== del.dataset.del); save(); return renderCart(); }
  const faq = e.target.closest(".faq-q");
  if (faq) return faq.parentElement.classList.toggle("open");
  if (e.target.closest("#cart-open")) return $("#cart-drawer")?.classList.remove("translate-x-full", "-translate-x-full");
  if (e.target.closest("#cart-close") || e.target.id === "cart-overlay") return $("#cart-drawer")?.classList.add("translate-x-full");
  if (e.target.closest("#lang-btn")) { state.lang = state.lang === "ar" ? "en" : "ar"; return applyLang(); }
  if (e.target.closest("#menu-btn")) return $("#mobile-menu")?.classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  applyLang();
});
