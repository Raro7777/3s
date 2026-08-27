// ============================================================
// 폰마트 — 사이트 동작 로직
// (수정할 일은 거의 없습니다. 데이터는 products.js, 설정은 config.js)
// ============================================================

const fmt = (n) => n.toLocaleString("ko-KR");

// ---------- CONFIG 적용 ----------
function applyConfig() {
  document.querySelectorAll("[data-store-name]").forEach((el) => (el.textContent = CONFIG.storeName));
  document.querySelectorAll("[data-phone-text]").forEach((el) => (el.textContent = CONFIG.phone));
  document.querySelectorAll("[data-phone-link]").forEach((el) => (el.href = "tel:" + CONFIG.phone.replace(/-/g, "")));
  document.querySelectorAll("[data-hours]").forEach((el) => (el.textContent = CONFIG.hours));

  const kakaoBtns = document.querySelectorAll("[data-kakao-link]");
  kakaoBtns.forEach((el) => {
    if (CONFIG.kakaoUrl) el.href = CONFIG.kakaoUrl;
    else el.style.display = "none";
  });

  document.title = `${CONFIG.storeName} — 삼성·애플 최신 스마트폰 최저가 상담`;
}

// ---------- 이미지 폴백 체인 ----------
// images/모델명.png → .jpg → .webp → .svg 순서로 시도, 모두 없으면 플레이스홀더.
// 공식 홈페이지에서 받은 png/jpg를 넣으면 기본 제공되는 svg 렌더를 자동으로 대체합니다.
const IMG_EXTS = ["png", "jpg", "webp", "svg"];

function attachImgFallback(imgEl, product) {
  let attempt = 0;
  const setSrc = () => {
    const ext = IMG_EXTS[attempt];
    imgEl.classList.toggle("is-vector", ext === "svg");
    imgEl.src = `${product.img}.${ext}`;
  };
  setSrc();
  imgEl.onerror = () => {
    attempt += 1;
    if (attempt < IMG_EXTS.length) {
      setSrc();
    } else {
      imgEl.onerror = null;
      imgEl.replaceWith(buildPlaceholder(product));
    }
  };
}

function buildPlaceholder(product) {
  const div = document.createElement("div");
  div.className = `ph ${product.brand}`;
  const isFold = /폴드|플립/.test(product.name);
  div.innerHTML = `
    <svg viewBox="0 0 60 96" aria-hidden="true">
      <rect x="6" y="4" width="48" height="88" rx="9" fill="none" stroke="currentColor" stroke-width="2.5"/>
      ${isFold ? '<line x1="30" y1="6" x2="30" y2="90" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>' : '<circle cx="30" cy="84" r="2.6" fill="currentColor"/>'}
      <rect x="22" y="12" width="16" height="3.5" rx="1.75" fill="currentColor"/>
    </svg>
    <strong>${product.name}</strong>
    <span>제품 이미지 준비중</span>`;
  return div;
}

// ---------- 제품 카드 렌더링 ----------
const BRAND_LABEL = { samsung: "SAMSUNG", apple: "Apple" };

function productCard(p) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = p.id;

  const media = document.createElement("div");
  media.className = "card-media";
  const img = document.createElement("img");
  img.alt = p.name;
  img.loading = "lazy";
  attachImgFallback(img, p);
  media.appendChild(img);
  if (p.badge) {
    const b = document.createElement("span");
    b.className = `badge badge-${p.badge === "NEW" ? "new" : p.badge === "인기" ? "hot" : "value"}`;
    b.textContent = p.badge;
    media.appendChild(b);
  }

  const colorDots = p.colors.length
    ? `<div class="dots">${p.colors.map((c) => `<i style="background:${c.hex}" title="${c.name}"></i>`).join("")}</div>`
    : "";

  card.appendChild(media);
  card.insertAdjacentHTML(
    "beforeend",
    `<div class="card-body">
       <span class="card-brand">${BRAND_LABEL[p.brand]}</span>
       <h3>${p.name}</h3>
       <p class="card-tag">${p.tagline}</p>
       <div class="card-meta">
         <div class="chips">${p.storages.map((s) => `<span>${s}</span>`).join("")}</div>
         ${colorDots}
       </div>
       <div class="card-price">
         <em>출고가</em> <strong>${fmt(p.price)}원~</strong>
         <small>실구매가는 상담 시 안내</small>
       </div>
       <div class="card-actions">
         <button class="btn btn-ghost" data-detail>자세히</button>
         <button class="btn btn-primary" data-consult>최저가 상담</button>
       </div>
     </div>`
  );

  card.querySelector("[data-detail]").addEventListener("click", () => openModal(p));
  card.querySelector("[data-consult]").addEventListener("click", () => gotoConsult(p.id));
  return card;
}

function isFoldable(p) {
  return /폴드|플립/.test(p.name);
}

function renderProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  PRODUCTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "foldable") return isFoldable(p);
    return p.brand === filter;
  }).forEach((p) => grid.appendChild(productCard(p)));
}

function initTabs() {
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      renderProducts(btn.dataset.filter);
    });
  });
}

// ---------- 상세 모달 ----------
function openModal(p) {
  const modal = document.getElementById("modal");
  const box = modal.querySelector(".modal-media");
  box.innerHTML = "";
  const img = document.createElement("img");
  img.alt = p.name;
  attachImgFallback(img, p);
  box.appendChild(img);

  modal.querySelector(".modal-brand").textContent = BRAND_LABEL[p.brand];
  modal.querySelector(".modal-name").textContent = p.name;
  modal.querySelector(".modal-tag").textContent = p.tagline;
  modal.querySelector(".modal-price").innerHTML = `출고가 <strong>${fmt(p.price)}원~</strong>`;
  modal.querySelector(".modal-storages").innerHTML = p.storages.map((s) => `<span>${s}</span>`).join("");

  const colorWrap = modal.querySelector(".modal-colors");
  colorWrap.innerHTML = p.colors.length
    ? p.colors.map((c) => `<span class="color-item"><i style="background:${c.hex}"></i>${c.name}</span>`).join("")
    : `<span class="muted">색상은 상담 시 안내드립니다</span>`;

  const link = modal.querySelector(".modal-official");
  link.href = p.official;

  modal.querySelector("[data-modal-consult]").onclick = () => {
    closeModal();
    gotoConsult(p.id);
  };

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
}

// ---------- 상담 폼 ----------
function initFormModels() {
  const sel = document.getElementById("f-model");
  PRODUCTS.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
}

function gotoConsult(productId) {
  if (productId) document.getElementById("f-model").value = productId;
  document.getElementById("consult").scrollIntoView({ behavior: "smooth" });
}

function productName(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  return p ? p.name : "미정";
}

async function submitForm(e) {
  e.preventDefault();
  const msgBox = document.getElementById("form-msg");
  msgBox.className = "form-msg";
  msgBox.textContent = "";

  const data = {
    name: document.getElementById("f-name").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    model: productName(document.getElementById("f-model").value),
    carrier: document.getElementById("f-carrier").value,
    purchase_type: document.getElementById("f-type").value,
    internet_bundle: document.getElementById("f-internet").checked,
    message: document.getElementById("f-msg").value.trim()
  };

  if (!data.name || !data.phone) {
    showFormMsg("err", "이름과 연락처를 입력해 주세요.");
    return;
  }
  if (!document.getElementById("f-agree").checked) {
    showFormMsg("err", "개인정보 수집·이용에 동의해 주세요.");
    return;
  }

  // Supabase가 설정되어 있으면 DB 저장, 아니면 문자(SMS)로 연결
  if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && window.supabase) {
    try {
      const client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      const { error } = await client.from("phone_consultations").insert([data]);
      if (error) throw error;
      showFormMsg("ok", "상담 신청이 접수되었습니다! 영업시간 내 빠르게 연락드리겠습니다.");
      e.target.reset();
      return;
    } catch (err) {
      console.error(err);
      showFormMsg("err", "접수 중 오류가 발생했습니다. 아래 전화 버튼으로 바로 문의해 주세요.");
      return;
    }
  }

  // SMS 폴백
  const body =
    `[${CONFIG.storeName} 상담신청]\n` +
    `이름: ${data.name}\n연락처: ${data.phone}\n관심모델: ${data.model}\n` +
    `현재통신사: ${data.carrier}\n구매방식: ${data.purchase_type}\n` +
    `인터넷결합: ${data.internet_bundle ? "관심있음" : "해당없음"}` +
    (data.message ? `\n문의: ${data.message}` : "");
  const num = CONFIG.phone.replace(/-/g, "");
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  location.href = isIOS ? `sms:${num}&body=${encodeURIComponent(body)}` : `sms:${num}?body=${encodeURIComponent(body)}`;
  showFormMsg("ok", "문자 앱이 열리면 그대로 전송해 주세요. 전화 상담도 환영합니다!");
}

function showFormMsg(type, text) {
  const msgBox = document.getElementById("form-msg");
  msgBox.className = `form-msg ${type}`;
  msgBox.textContent = text;
}

// ---------- Supabase 스크립트 지연 로드 ----------
function loadSupabaseIfConfigured() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return;
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  document.head.appendChild(s);
}

// ---------- 스크롤 애니메이션 ----------
function initReveal() {
  if (!("IntersectionObserver" in window)) return; // 미지원 시 항상 표시
  document.documentElement.classList.add("anim");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// ---------- 초기화 ----------
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  loadSupabaseIfConfigured();
  renderProducts();
  initTabs();
  initFormModels();
  initReveal();

  document.getElementById("consult-form").addEventListener("submit", submitForm);
  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
});
