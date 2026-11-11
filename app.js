const products = window.BOT_PRODUCTS || [];
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const strategyFilter = document.getElementById("strategyFilter");
const capitalFilter = document.getElementById("capitalFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("productModal");
let quickStrategy = "all";

const money = n => `$${Number(n).toLocaleString("en-US")}`;
function productOrderLink(p) 
  const msg = `السلام عليكم ورحمة الله وبركاته 🌟

أرغب بطلب وتنصيب أحد روبوتات التداول الآلي من BOT CENTER، وأرجو تزويدي بتفاصيل إكمال إجراءات الطلب والتنصيب.

🤖 اسم البوت: ${p.name}

💰 يرجى تزويدي بطرق الدفع المتاحة لإكمال إجراءات الشراء.

بانتظار تواصلكم وإرشاداتكم لإتمام عملية الطلب والتنصيب.

شكراً لجهودكم وثقتنا بخدماتكم 🌐

BOT CENTER | Smart Trading Systems 🔷`;
  return `https://t.me/Bot_SupportFX?text=${encodeURIComponent(msg)}`;
} {
  const msg = `السلام عليكم، أريد تفاصيل وطلب بوت ${p.name}.\\nتنصيب الحاسوب: ${money(p.pc)}\\nتنصيب الموبايل: ${money(p.mobile)}`;
  https://t.me/Bot_SupportFX
}
function card(p, index) {
  return `<article class="product-card">
    <div class="product-image" data-open="${p.id}">
      <img src="./${p.image}" alt="${p.name}" loading="lazy">
      <span class="product-platform">${p.platform.includes("MT5") ? "MT5" : p.platform}</span>
      <span class="product-number">${String(index+1).padStart(2,"0")}</span>
    </div>
    <div class="product-body">
      <div class="product-meta"><span class="strategy-tag">${p.strategy}</span><span class="product-capital">${p.capital}</span></div>
      <h3>${p.name}</h3><p class="product-subtitle">${p.subtitle}</p>
      <div class="product-price-row"><div><span class="price-label">يبدأ من</span><strong class="product-price">${money(Math.min(p.pc,p.mobile))}<small> / حاسوب</small></strong></div></div>
      <div class="card-actions"><button class="card-details" data-open="${p.id}">التفاصيل</button><a class="card-order" href="${productOrderLink(p)}" target="_blank" rel="noopener">اطلب الآن ↗</a></div>
    </div>
  </article>`;
}
function capitalMatches(p, value) {
  if (value === "all") return true;
  if (value === "cent") return /سنت/.test(p.account);
  if (value === "under200") return p.capitalMax <= 200;
  if (value === "200-400") return p.capitalMin <= 400 && p.capitalMax >= 200;
  if (value === "400-800") return p.capitalMin <= 800 && p.capitalMax >= 400;
  if (value === "over800") return p.capitalMax > 800;
  return true;
}
function render() {
  const q = searchInput.value.trim().toLowerCase();
  const strategy = strategyFilter.value;
  const capital = capitalFilter.value;
  const filtered = products.filter(p => {
    const haystack = [p.name,p.subtitle,p.strategy,p.entry,p.capital,p.features.join(" ")].join(" ").toLowerCase();
    const matchQuick = quickStrategy === "all" || (quickStrategy === "cent" ? /سنت/.test(p.account) : p.strategy === quickStrategy);
    return (!q || haystack.includes(q)) && (strategy === "all" || p.strategy === strategy) && capitalMatches(p,capital) && matchQuick;
  });
  grid.innerHTML = filtered.map(p => card(p, products.indexOf(p))).join("");
  resultCount.textContent = filtered.length;
  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
}
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById("modalImage").src = `./${p.image}`;
  document.getElementById("modalImage").alt = p.name;
  document.getElementById("modalStrategy").textContent = p.strategy;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalSubtitle").textContent = p.subtitle;
  document.getElementById("modalCapital").textContent = p.capital;
  document.getElementById("modalEntry").textContent = p.entry;
  document.getElementById("modalFeatures").innerHTML = p.features.map(f=>`<li>${f}</li>`).join("");
  document.getElementById("modalLot").textContent = `حجم اللوت: ${p.lot}`;
  document.getElementById("modalPc").textContent = money(p.pc);
  document.getElementById("modalMobile").textContent = money(p.mobile);
  document.getElementById("modalIncluded").textContent = p.extra;
  document.getElementById("modalOrder").href = productOrderLink(p);
  const video = document.getElementById("modalVideo");
  if (p.video) { video.href = p.video; video.hidden = false; } else { video.hidden = true; }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  history.replaceState(null,"",`#bot-${p.id}`);
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if (location.hash.startsWith("#bot-")) history.replaceState(null,"", "#bots");
}
grid.addEventListener("click", e => {
  const trigger = e.target.closest("[data-open]");
  if (trigger) openProduct(trigger.dataset.open);
});
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.focus()}});
[searchInput,strategyFilter,capitalFilter].forEach(el=>el.addEventListener("input",render));
document.getElementById("quickFilters").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]"); if(!btn)return;
  quickStrategy=btn.dataset.filter;
  document.querySelectorAll(".quick-filter").forEach(b=>b.classList.toggle("selected",b===btn));
  render();
});
document.getElementById("resetFilters").addEventListener("click",()=>{
  searchInput.value="";strategyFilter.value="all";capitalFilter.value="all";quickStrategy="all";
  document.querySelectorAll(".quick-filter").forEach(b=>b.classList.toggle("selected",b.dataset.filter==="all"));
  render();
});
const menuToggle=document.getElementById("menuToggle"), mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>mainNav.classList.toggle("open"));
mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mainNav.classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
render();
if(location.hash.startsWith("#bot-")) openProduct(location.hash.slice(5));
