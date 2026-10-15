/* ============================================================
   GreenGuard — client-side logic (demo, no backend)
   All data lives here as sample constants.
   ============================================================ */
"use strict";

/* ---------------- sample data ---------------- */
const SATELLITE_FEEDS = [
  { label: "Watch Zone 1 — Satellite View", src: "assets/videos/settelite-1.mp4", coords: "17.4521° N, 78.3390° E", status: "normal", offset: 0, speed: 1 },
  { label: "Watch Zone 2 — Satellite View", src: "assets/videos/settelite-2.mp4", coords: "17.5088° N, 78.5741° E", status: "loss",   offset: 3, speed: 0.8 },
  { label: "Watch Zone 3 — Satellite View", src: "assets/videos/Sattelite-3.mp4", coords: "17.3103° N, 78.3965° E", status: "normal", offset: 6, speed: 1.2 },
];

const CCTV_SOURCES = [
  { src: "assets/videos/Cctv-1.mp4" },
  { src: "assets/videos/Cctv-2.mp4" },
  { src: "assets/videos/Sattelite-3.mp4" },
  { src: "assets/videos/settelite-1.mp4" },
  { src: "assets/videos/settelite-2.mp4" },
];

const CCTV_FEEDS = [
  { name: "CAM 01 — Forest Edge",    src: CCTV_SOURCES[0].src, status: "normal",     offset: 0,  speed: 1.0, look: "cctv soft" },
  { name: "CAM 02 — Trail Entrance", src: CCTV_SOURCES[0].src, status: "chainsaw",   offset: 7,  speed: 1.0, look: "cctv grainy" },
  { name: "CAM 03 — Camera 03", src: CCTV_SOURCES[1].src, status: "vehicle",    offset: 0,  speed: 1.0, look: "cctv soft" },
  { name: "CAM 04 — Camera 04",  src: CCTV_SOURCES[1].src, status: "person",     offset: 9,  speed: 1.0, look: "cctv soft" },
  { name: "CAM 05 — Ridge Watch",    src: CCTV_SOURCES[2].src, status: "normal",     offset: 3,  speed: 1.0, look: "cctv soft" },
  { name: "CAM 06 — Camera 06", src: CCTV_SOURCES[3].src, status: "Vehicle", offset: 0,  speed: 1.0, look: "cctv soft" },
];

const CCTV_STATUS_TEXT = { normal: "Normal", chainsaw: "Chainsaw Sound Detected", vehicle: "Vehicle Detected", person: "Person Detected" };

const WATCH_ZONES = [
  { name: "Kadambari Reserve Edge", lat: 17.4521, lng: 78.3390, status: "normal", lastCheck: "14 Oct 2026", reports: 5 },
  { name: "Mokila Ridge Commons",   lat: 17.5088, lng: 78.5741, status: "ignored-reports", lastCheck: "13 Oct 2026", reports: 14 },
  { name: "Osman Sagar Buffer",     lat: 17.3103, lng: 78.3965, status: "review", lastCheck: "12 Oct 2026", reports: 8 },
  { name: " Shameerpet North Belt", lat: 17.6040, lng: 78.5820, status: "review", lastCheck: "11 Oct 2026", reports: 9 },
  { name: "Ananthagiri Fringe",     lat: 17.2560, lng: 78.2020, status: "ignored-reports", lastCheck: "10 Oct 2026", reports: 17 },
];

const ZONE_COLORS = { normal: "#35d07f", review: "#f5c451", "ignored-reports": "#e5484d" };

/* Supplies case list — statuses: Sent | Acknowledged | Action Taken | Ignored */
const SAMPLE_CASES = [
  { id: "GG-0001", location: "Mokila Ridge Commons",   date: "2026-09-02", status: "Ignored",      days: 43, type: "Land clearing" },
  { id: "GG-0002", location: "Osman Sagar Buffer",     date: "2026-09-06", status: "Ignored",      days: 39, type: "Tree cutting" },
  { id: "GG-0003", location: "Ananthagiri Fringe",     date: "2026-09-08", status: "Action Taken", days: 0,  type: "Land clearing" },
  { id: "GG-0004", location: "Kadambari Reserve Edge", date: "2026-09-10", status: "Acknowledged", days: 35, type: "Burning" },
  { id: "GG-0005", location: "Shameerpet North Belt",  date: "2026-09-13", status: "Action Taken", days: 0,  type: "Dumping" },
  { id: "GG-0006", location: "Mokila Ridge Commons",   date: "2026-09-17", status: "Ignored",      days: 28, type: "Burning" },
  { id: "GG-0007", location: "Ananthagiri Fringe",     date: "2026-09-21", status: "Acknowledged", days: 24, type: "Tree cutting" },
  { id: "GG-0008", location: "Osman Sagar Buffer",     date: "2026-09-25", status: "Sent",         days: 20, type: "Dumping" },
  { id: "GG-0009", location: "Kadambari Reserve Edge", date: "2026-09-29", status: "Action Taken", days: 0,  type: "Tree cutting" },
  { id: "GG-0010", location: "Shameerpet North Belt",  date: "2026-10-02", status: "Sent",         days: 13, type: "Land clearing" },
  { id: "GG-0011", location: "Mokila Ridge Commons",   date: "2026-10-06", status: "Acknowledged", days: 9,  type: "Dumping" },
  { id: "GG-0012", location: "Ananthagiri Fringe",     date: "2026-10-09", status: "Sent",         days: 6,  type: "Tree cutting" },
];

let cases = [...SAMPLE_CASES];
let nextCaseNum = cases.length + 1;
let currentFilter = "all";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const STATUS_CLASS = { "Sent": "st-sent", "Acknowledged": "st-ack", "Action Taken": "st-action", "Ignored": "st-ignored" };
const STATUS_COLOR = { "Sent": "#8b9a90", "Acknowledged": "#f5c451", "Action Taken": "#35d07f", "Ignored": "#e5484d" };

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ---------------- animated hero counters ---------------- */
function animateCounters() {
  $$(".counter").forEach((el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ---------------- video helpers ---------------- */
function makeVideo(src, cls, { muted = true, preload = "auto", playsinline = true } = {}) {
  const v = document.createElement("video");
  v.src = src;
  v.muted = muted;
  v.loop = true;
  v.autoplay = muted && preload !== "none";
  v.playsInline = playsinline;
  v.preload = preload;
  v.setAttribute("playsinline", "");
  v.setAttribute("muted", "");
  if (cls) v.className = cls;

  // keep playback alive even if autoplay is deferred by the browser
  v.addEventListener("canplay", () => safePlay(v));
  document.addEventListener("click", function retry() { safePlay(v); document.removeEventListener("click", retry); }, { once: true });

  v.addEventListener("error", () => showPlaceholder(v.parentElement));
  return v;
}

function showPlaceholder(container, msg = "Video unavailable in demo") {
  if (!container || container.querySelector(".video-placeholder")) return;
  container.querySelectorAll("video, .tint-layer").forEach((n) => n.remove());
  const ph = document.createElement("div");
  ph.className = "video-placeholder";
  ph.innerHTML = `<span>🚫</span><span>${msg}</span>`;
  container.appendChild(ph);
}

function safePlay(v) { v.play().catch(() => {}); }

/* smoother buffering: keep the pipe full without pausing the visible frame
   Desktop browsers often cap bandwidth per video; preloading extra early and
   not seeking past the buffer helps avoid the “blank then catch up” stutter. */
const VIDEO_CACHE = new Map();
function getCachedVideo(src, opts = {}) {
  const key = src + "|" + opts.speed + "|" + opts.offset;
  if (!VIDEO_CACHE.has(key)) { const v = makeVideo(src, "", opts); VIDEO_CACHE.set(key, v); }
  return VIDEO_CACHE.get(key);
}

/* ---------------- satellite group ---------------- */
function buildSatellite() {
  const frame = $("#satFrame");
  const thumbsWrap = $("#satThumbs");
  const feeds = SATELLITE_FEEDS;

  feeds.forEach((f, i) => {
    // main player layers
    const wrap = document.createElement("div");
    wrap.className = "sat-layer";
    wrap.style.cssText = "position:absolute;inset:0;";
    if (i !== 0) wrap.style.display = "none";
    const v = getCachedVideo(f.src, { preload: "auto", speed: f.speed, offset: f.offset });
    v.currentTime = f.offset;
    v.playbackRate = f.speed;
    v.style.cssText = "width:100%;height:100%;object-fit:cover;filter:saturate(.65) contrast(1.35) hue-rotate(45deg) sepia(.25) brightness(.85);animation:satZoom 40s ease-in-out infinite alternate;";
    wrap.appendChild(v);
    wrap.insertAdjacentHTML("beforeend",
      `<div class="sat-tint"></div><div class="sat-grid-lines"></div><div class="sat-scanline"></div>`);
    frame.appendChild(wrap);

    // thumbnail
    const th = document.createElement("button");
    th.className = "sat-thumb" + (i === 0 ? " active" : "");
    th.setAttribute("aria-label", f.label);
    const tv = getCachedVideo(f.src, { preload: "metadata", speed: f.speed, offset: f.offset });
    tv.currentTime = f.offset;
    tv.playbackRate = f.speed;
    th.appendChild(tv);
    th.insertAdjacentHTML("beforeend", `<span class="thumb-label">${f.label}</span>`);
    th.addEventListener("click", () => selectSatFeed(i));
    tv.addEventListener("loadeddata", () => { try { tv.currentTime = f.offset; } catch (e) {} });
    thumbsWrap.appendChild(th);
  });

  selectSatFeed(0);
}

function selectSatFeed(idx) {
  const feed = SATELLITE_FEEDS[idx];
  $$("#satFrame .sat-layer").forEach((layer, i) => {
    layer.style.display = i === idx ? "block" : "none";
    const v = layer.querySelector("video");
    if (!v) return;
    if (i === idx) { try { v.currentTime = feed.offset; } catch (e) {} v.playbackRate = feed.speed; safePlay(v); }
    else { try { v.pause(); } catch (e) {} }
  });
  $$("#satThumbs .sat-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
  $("#satLabel").textContent = feed.label;
  $("#satCoords").textContent = feed.coords;
  const chip = $("#satStatus");
  if (feed.status === "loss") {
    chip.textContent = "Green Cover Loss Detected";
    chip.className = "status-chip alert";
    $("#satLossBox").hidden = false;
  } else {
    chip.textContent = "Normal";
    chip.className = "status-chip normal";
    $("#satLossBox").hidden = true;
  }
}

/* ---------------- CCTV group ---------------- */
function buildCCTV() {
  const grid = $("#cctvGrid");
  CCTV_FEEDS.forEach((f) => {
    const tile = document.createElement("div");
    tile.className = "cctv-tile";
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-label", `Open ${f.name} full view`);

    const frame = document.createElement("div");
    frame.className = `video-frame ${f.look}`;
    frame.style.aspectRatio = "4/3";
    // Use a cached video so the caller can dictate exactly one src per tile.
    const v = getCachedVideo(f.src, { preload: "auto", speed: f.speed, offset: f.offset });
    v.playbackRate = f.speed;
    v.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;inset:0;";
    frame.appendChild(v);
    frame.insertAdjacentHTML("beforeend",
      `<div class="grain"></div><div class="vignette"></div>`);
    v.addEventListener("loadeddata", () => { try { v.currentTime = f.offset; } catch (e) {} });

    const alert = f.status !== "normal";
    tile.appendChild(frame);
    tile.insertAdjacentHTML("beforeend", `
      <span class="cctv-name">${f.name}</span>
      <span class="rec-dot">REC</span>
      <span class="status-chip ${alert ? "alert" : "normal"}" style="top:auto;bottom:8px;right:8px;">${CCTV_STATUS_TEXT[f.status]}</span>
      <span class="ov-clock" data-clock="cctv" style="bottom:38px;left:8px;font-size:0.7rem;"></span>
    `);
    const open = () => openCCTVModal(f, f.src);
    tile.addEventListener("click", open);
    tile.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    grid.appendChild(tile);
  });
}

/* ---------------- clocks ---------------- */
function startClocks() {
  function tick() {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-GB");
    $$("[data-clock]").forEach((el) => { el.textContent = `${dateStr} ${timeStr} IST`; });
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------------- before / after slider ---------------- */
function initBeforeAfter() {
  // simple generated placeholder scenery
  const trees = [
    [60, 210, 3.4], [130, 240, 2.8], [200, 225, 3.9], [265, 250, 3.0], [335, 220, 3.6],
    [405, 245, 3.2], [470, 215, 4.0], [535, 240, 3.1], [95, 165, 2.4], [300, 170, 2.6], [520, 160, 2.5],
  ];
  $("#ba-trees").innerHTML = trees.map(([x, y, s]) =>
    `<g transform="translate(${x},${y}) scale(${s / 3})">
       <rect x="-4" y="0" width="8" height="24" fill="#4a3220"/>
       <ellipse cx="0" cy="-18" rx="26" ry="30" fill="#2f7d44"/>
       <ellipse cx="-12" cy="-30" rx="16" ry="18" fill="#3a9757"/>
       <ellipse cx="14" cy="-28" rx="17" ry="20" fill="#35894f"/>
     </g>`).join("");
  $("#ba-stumps").innerHTML = trees.map(([x, y, s]) =>
    `<g transform="translate(${x},${y}) scale(${s / 3})">
       <ellipse cx="0" cy="4" rx="14" ry="4" fill="#6b4a30"/>
       <rect x="-8" y="-8" width="16" height="12" rx="2" fill="#8a6140"/>
       <circle cx="0" cy="-8" r="5" fill="#a07a52"/>
       <circle cx="0" cy="-8" r="2" fill="#c49a6c"/>
     </g>`).join("");

  const slider = $("#baSlider");
  const after = $("#baAfter");
  const handle = $("#baHandle");
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + "%";
    handle.setAttribute("aria-valuenow", Math.round(pct));
  }

  slider.addEventListener("pointerdown", (e) => { dragging = true; slider.setPointerCapture(e.pointerId); setPos(e.clientX); });
  slider.addEventListener("pointermove", (e) => { if (dragging) setPos(e.clientX); });
  slider.addEventListener("pointerup", () => { dragging = false; });
  handle.addEventListener("keydown", (e) => {
    const cur = parseFloat(handle.style.left) || 50;
    if (e.key === "ArrowLeft") { e.preventDefault(); after.style.clipPath = `inset(0 ${100 - Math.max(2, cur - 4)}% 0 0)`; handle.style.left = Math.max(2, cur - 4) + "%"; }
    if (e.key === "ArrowRight") { e.preventDefault(); after.style.clipPath = `inset(0 ${100 - Math.min(98, cur + 4)}% 0 0)`; handle.style.left = Math.min(98, cur + 4) + "%"; }
  });

  after.style.clipPath = "inset(0 50% 0 0)";
}

/* ---------------- watch zone map ---------------- */
function initMap() {
  if (!window.L) return;
  const center = [17.42, 78.40];
  const map = L.map("map", { scrollWheelZoom: true }).setView(center, 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  WATCH_ZONES.forEach((z) => {
    const color = ZONE_COLORS[z.status];
    const marker = L.circleMarker([z.lat, z.lng], {
      radius: 13, color, fillColor: color, fillOpacity: 0.85, weight: 2,
    }).addTo(map);
    const statusText = z.status === "normal" ? "Normal" : z.status === "review" ? "Under review" : "Ignored reports";
    marker.bindPopup(`
      <div class="map-popup">
        <b>${z.name}</b><br/>
        Status: ${statusText}<br/>
        Last satellite check: ${z.lastCheck}<br/>
        Reports: ${z.reports}
      </div>`);
  });
}

/* ---------------- report form ---------------- */
function initReportForm() {
  const form = $("#reportForm");
  const photoInput = $("#photoInput");
  const photoPreview = $("#photoPreview");
  const photoImg = $("#photoImg");
  const gpsInput = $("#gpsInput");
  const gpsBtn = $("#gpsBtn");
  const gpsErr = $("#gpsErr");
  const dtInput = $("#dateTime");
  const success = $("#reportSuccess");
  let photoData = null;
  let gpsCaptured = false;

  const setNow = () => {
    dtInput.value = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };
  setNow();
  setInterval(setNow, 1000);

  photoInput.addEventListener("change", () => {
    const f = photoInput.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { photoData = reader.result; photoImg.src = photoData; photoPreview.hidden = false; };
    reader.readAsDataURL(f);
  });
  $("#photoRemove").addEventListener("click", () => {
    photoData = null; photoInput.value = ""; photoPreview.hidden = true;
  });

  gpsBtn.addEventListener("click", () => {
    gpsErr.hidden = true;
    if (!("geolocation" in navigator)) { gpsErr.textContent = "Geolocation not supported — please type the location manually."; gpsErr.hidden = false; return; }
    gpsBtn.textContent = "📡 Locating…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gpsCaptured = true;
        gpsInput.value = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
        gpsBtn.textContent = "📍 GPS captured ✓";
      },
      (err) => {
        gpsErr.textContent = `GPS unavailable (${err.message}) — type the location manually.`;
        gpsErr.hidden = false;
        gpsBtn.textContent = "📍 Capture GPS";
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  gpsInput.addEventListener("input", () => { gpsCaptured = gpsInput.value.trim().length > 4; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = $("#incidentType").value;
    if (!photoData) { showToast(); success.className = "success-msg err-box"; success.textContent = "A photo is required."; success.hidden = false; return; }
    if (!gpsCaptured) { gpsErr.textContent = "Capture GPS or type the location manually."; gpsErr.hidden = false; return; }
    if (!type) { alert("Please select the incident type."); return; }

    const caseId = "GG-" + String(nextCaseNum).padStart(4, "0");
    nextCaseNum++;
    cases.unshift({
      id: caseId,
      location: gpsInput.value.split(",")[0].trim() || "Citizen report",
      date: new Date().toISOString().slice(0, 10),
      status: "Sent",
      days: 0,
      type: type,
    });
    gpsCaptured = false;

    form.reset();
    photoData = null; photoPreview.hidden = true;
    setNow(); gpsBtn.textContent = "📍 Capture GPS";
    success.hidden = false;
    success.className = "success-msg";
    success.textContent = `✔ Report submitted. Case ID: ${caseId} — status “Sent”. It is now visible on the public Accountability Tracker.`;
    renderTracker();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------------- accountability tracker ---------------- */
function renderTracker() {
  // dashboard cards
  const counts = { Sent: 0, Acknowledged: 0, "Action Taken": 0, Ignored: 0 };
  let waitSum = 0, waitN = 0;
  cases.forEach((c) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
    if (c.status !== "Action Taken") { waitSum += c.days; waitN++; }
  });
  const avg = waitN ? Math.round(waitSum / waitN) : 0;
  $("#dashCards").innerHTML = `
    <div class="dash-card"><span class="num">${cases.length}</span><span class="lbl">Total Reports</span></div>
    <div class="dash-card c-ack"><span class="num">${counts.Acknowledged}</span><span class="lbl">Acknowledged</span></div>
    <div class="dash-card c-action"><span class="num">${counts["Action Taken"]}</span><span class="lbl">Action Taken</span></div>
    <div class="dash-card c-ignored"><span class="num">${counts.Ignored}</span><span class="lbl">Ignored</span></div>
    <div class="dash-card"><span class="num">${avg}d</span><span class="lbl">Average Response Time</span></div>`;

  // donut
  const donut = $("#donutChart");
  const R = 15.9155, C = 2 * Math.PI * R;
  let segs = "", legend = "", offsetAcc = 0;
  [[counts.Sent, "Sent", "#8b9a90"], [counts.Acknowledged, "Acknowledged", "#f5c451"], [counts["Action Taken"], "Action Taken", "#35d07f"], [counts.Ignored, "Ignored", "#e5484d"]]
    .forEach(([n, label, color]) => {
      if (!n) return;
      const frac = n / cases.length;
      segs += `<circle cx="21" cy="21" r="${R}" fill="transparent" stroke="${color}" stroke-width="4" stroke-dasharray="${(frac * C).toFixed(2)} ${(C - frac * C).toFixed(2)}" stroke-dashoffset="${-offsetAcc.toFixed(2)}"/>`;
      legend += `<span><i style="background:${color}"></i>${label} — ${n} (${Math.round(frac * 100)}%)</span>`;
      offsetAcc += frac * C;
    });    donut.innerHTML = segs;
  $("#donutLegend").innerHTML = legend;

  // table
  const tbody = $("#caseTableBody");
  const term = ($("#caseSearch").value || "").toLowerCase();
  let shown = 0;
  tbody.innerHTML = cases
    .filter((c) => currentFilter === "all" || c.status === currentFilter)
    .filter((c) => !term || c.id.toLowerCase().includes(term) || c.location.toLowerCase().includes(term) || (c.type || "").toLowerCase().includes(term))
    .map((c) => {
      const waitCls = c.days >= 30 ? "crit" : c.days >= 7 ? "warn" : "";
      let action = "";
      if (c.status === "Ignored") action = `<button class="action-btn" data-act="post" data-id="${c.id}">Generate Public Post</button>`;
      if (c.status !== "Action Taken" && c.days >= 30) {
        action += `<button class="action-btn rti" data-act="rti" data-id="${c.id}">Generate RTI Draft</button>`;
      }
      return `<tr>
        <td class="case-id">${c.id}</td>
        <td>${c.location}${c.type ? `<br/><small style="color:var(--muted)">${c.type}</small>` : ""}</td>
        <td>${fmtDate(c.date)}</td>
        <td><span class="st-badge ${STATUS_CLASS[c.status]}">${c.status}</span></td>
        <td class="days-wait ${waitCls}">${c.days}</td>
        <td>${action || '<span style="color:var(--muted)">—</span>'}</td>
      </tr>`;
    }).join("");
  shown = tbody.querySelectorAll("tr").length;
  $("#caseEmpty").hidden = shown > 0;
}

function initTrackerUI() {
  renderTracker();
  $("#statusFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    $$(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
    renderTracker();
  });
  $("#caseSearch").addEventListener("input", renderTracker);
  $("#caseTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return;
    const c = cases.find((x) => x.id === btn.dataset.id);
    if (!c) return;
    if (btn.dataset.act === "post") showPublicPost(c);
    else showRTI(c);
  });
}

/* ---------------- generated cards ---------------- */
function openModal(title, bodyHTML) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = bodyHTML;
  $("#modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal").classList.remove("open");
  $("#modalBody").innerHTML = "";
  document.body.style.overflow = "";
}
function initModal() {
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target === $("#modal")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}

function copyText(txt, btn) {
  const done = () => { btn.textContent = "✓ Copied"; btn.classList.add("copied"); setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1800); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
  else fallbackCopy(txt, done);
}
function fallbackCopy(txt, done) {
  const ta = document.createElement("textarea");
  ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  ta.remove(); done();
}

function showPublicPost(c) {
  const dateStr = fmtDate(c.date);
  const text = `GreenGuard — public scoreboard update (facts only)

Case ID: ${c.id}
Location: ${c.location}
Incident type: ${c.type}
Date reported: ${dateStr}
Days without a recorded response: ${c.days}

All figures are as recorded in the GreenGuard app. Officials can update the case status at any time; quick action shows as green on the public tracker.

#GreenGuard #SDG15 #LifeOnLand`;

  openModal("Generate Public Post", `
    <div class="modal-text"><div class="gen-card">
      <div class="gen-type">Factual public post · Case ${c.id}</div>
      <div class="gen-photo">📷 Photo placeholder — ${c.type} evidence (demo)</div>
      <h4>${c.location}</h4>
      <p>Reported: <strong>${dateStr}</strong></p>
      <p>Days ignored: <strong style="color:var(--red)">${c.days}</strong> — no response recorded in the app.</p>
      <p class="gen-hash">#GreenGuard #SDG15 #LifeOnLand</p>
      <div class="gen-actions">
        <button class="copy-btn" id="genCopy">Copy</button>
        <small style="color:var(--muted)">Facts only. No blame, no individual named.</small>
      </div>
    </div></div>`);
  $("#genCopy").addEventListener("click", (e) => copyText(text, e.target));
}

function showRTI(c) {
  const dateStr = fmtDate(c.date);
  const text = `SAMPLE RTI APPLICATION — DRAFT (demo)

To: The Public Information Officer,
    Forest & Environment Department,
    Government of Telangana, Hyderabad.

Subject: Request for information regarding report ${c.id},
dated ${dateStr}, concerning ${c.type.toLowerCase()} at/near ${c.location}.

Respected Sir/Madam,

1. Please provide a copy of the action-taken report on complaint/representation
   ${c.id}, submitted on ${dateStr}, regarding ${c.type.toLowerCase()} in or near ${c.location}.
2. Please state the current official status of that complaint.
3. Please provide copies of all inspection notes, if any, related to the complaint.

Application fee of ₹10 enclosed by Indian Postal Order, drawn in favour of the
Accounts Officer, Forest & Environment Department.

(Information sought under the Right to Information Act, 2005.)

Place: Hyderabad                                    Applicant signature: ______
Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}

Note: This is a sample draft for demonstration. Check current RTI procedure and
the correct jurisdiction before filing. The application seeks information only
and makes no allegation of illegality.`;

  openModal(`Generate RTI Draft — Case ${c.id} (${c.days} days waiting)`, `
    <div class="modal-text">
      <p style="color:var(--muted);font-size:0.9rem;margin:0 0 14px;">Sample text for demonstration. Review and adapt before filing.</p>
      <div class="gen-rti-text">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</div>
      <div class="gen-actions"><button class="copy-btn" id="genCopy">Copy RTI text</button></div>
    </div>`);
  $("#genCopy").addEventListener("click", (e) => copyText(text, e.target));
}

/* subtle inline error toast on missing photo */
function showToast() {}

/* ---------------- CCTV modal ---------------- */
function openCCTVModal(f, src) {
  // always show the tile's own source in the fulL-view modal
  const look = f.look;
  openModal(f.name, `
    <div class="modal-video-wrap">
      <div class="video-frame ${look}" id="modalFrame"></div>
    </div>
    <div class="modal-text" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
      <span class="status-chip ${f.status !== "normal" ? "alert" : "normal"}" style="position:static;">${CCTV_STATUS_TEXT[f.status]}</span>
      <span class="ov-clock" data-clock="cctv" style="position:static;color:var(--green);font-family:monospace;"></span>
    </div>`);
  const frame = $("#modalFrame");
  const v = getCachedVideo(src || f.src, { preload: "auto", speed: f.speed, offset: f.offset });
  v.playbackRate = f.speed;
  v.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;inset:0;";
  frame.appendChild(v);
  frame.insertAdjacentHTML("beforeend", `<div class="grain"></div><div class="vignette"></div><span class="rec-dot">REC</span>`);
  v.addEventListener("loadeddata", () => { try { v.currentTime = f.offset; } catch (e) {} });
  safePlay(v);
  startClocks(); // rebind new clock elements
}

/* ---------------- NGO buttons ---------------- */
function initNGOButtons() {
  $("#volunteerBtn").addEventListener("click", () => {
    $("#volunteerMsg").hidden = false;
  });
  document.querySelectorAll(".drive-signup").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("signed")) { btn.textContent = "✓ Signed Up"; btn.classList.add("signed"); }
    });
  });
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  animateCounters();
  buildSatellite();
  buildCCTV();
  startClocks();
  initBeforeAfter();
  initMap();
  initReportForm();
  initTrackerUI();
  initModal();
  initNGOButtons();
  initCamGraph();
});

/* ---------------- interactive camera graph ---------------- */
function initCamGraph() {
  const NODE = document.getElementById("camGraph");
  if (!NODE) return;
  const feeds = CCTV_FEEDS;
  const pad = 18, top = 26, bottom = 18, gap = 14;
  const w = NODE.clientWidth - pad * 2, h = NODE.clientHeight - top - bottom;
  const cols = 3, rows = Math.ceil(feeds.length / cols);
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows - 1)) / rows;
  const positions = feeds.map((f, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    return { x: pad + col * (cw + gap) + cw / 2, y: top + row * (ch + gap) + ch / 2 };
  });
  const SVGNS = "http://www.w3.org/2000/svg";
  const bg = document.createElementNS(SVGNS, "rect");
  bg.setAttribute("x", 0); bg.setAttribute("y", 0); bg.setAttribute("width", NODE.clientWidth); bg.setAttribute("height", NODE.clientHeight);
  bg.setAttribute("fill", "#f3ead7");
  NODE.appendChild(bg);
  const edges = document.createElementNS(SVGNS, "g");
  const rH = 32, rW = 56, rHead = 12;
  for (let i = 0; i < feeds.length; i++) {
    const a = positions[i];
    const isAlert = feeds[i].status !== "normal";
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${a.x},${a.y})`);
    g.setAttribute("class", "cam-node");
    const hdr = document.createElementNS(SVGNS, "circle");
    hdr.setAttribute("r", rHead);
    hdr.setAttribute("fill", isAlert ? "#c23b3b" : "#35d07f");
    hdr.setAttribute("stroke", "#ffffff");
    hdr.setAttribute("stroke-width", 2);
    g.appendChild(hdr);
    const body = document.createElementNS(SVGNS, "rect");
    body.setAttribute("x", -rW / 2);
    body.setAttribute("y", rHead + 4);
    body.setAttribute("width", rW);
    body.setAttribute("height", rH);
    body.setAttribute("rx", 8);
    body.setAttribute("fill", isAlert ? "rgba(194,59,59,0.08)" : "rgba(53,208,127,0.08)");
    body.setAttribute("stroke", isAlert ? "#c23b3b" : "#35d07f");
    body.setAttribute("stroke-width", 1.5);
    body.setAttribute("stroke-dasharray", isAlert ? "3 3" : "none");
    g.appendChild(body);
    const line1 = document.createElementNS(SVGNS, "text");
    line1.setAttribute("y", rHead + 22);
    line1.setAttribute("text-anchor", "middle");
    line1.setAttribute("font-size", "10");
    line1.setAttribute("font-family", "system-ui, sans-serif");
    line1.setAttribute("fill", "#232a23");
    line1.setAttribute("font-weight", 700);
    line1.textContent = feeds[i].name;
    g.appendChild(line1);
    const line2 = document.createElementNS(SVGNS, "text");
    line2.setAttribute("y", rHead + 38);
    line2.setAttribute("text-anchor", "middle");
    line2.setAttribute("font-size", "9");
    line2.setAttribute("font-family", "system-ui, sans-serif");
    line2.setAttribute("fill", "#6c7568");
    line2.textContent = CCTV_STATUS_TEXT[feeds[i].status];
    g.appendChild(line2);
    if (isAlert) {
      const ring = document.createElementNS(SVGNS, "circle");
      ring.setAttribute("r", rHead + 6);
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#c23b3b");
      ring.setAttribute("stroke-width", 2);
      ring.setAttribute("opacity", 0.9);
      g.appendChild(ring);
      ring.setAttribute("class", "pulse-ring");
      const ring2 = g.querySelector("circle:last-of-type");
      if (ring2) ring2.setAttribute("class", "pulse-ring");
    }
    NODE.appendChild(g);
    if (i + 1 < feeds.length) {
      const b = positions[i + 1];
      const path = document.createElementNS(SVGNS, "path");
      const yMid = (a.y + b.y) / 2;
      path.setAttribute("d", `M${a.x},${a.y + rHead + 10} C${a.x},${yMid} ${b.x},${yMid} ${b.x},${b.y - rHead - 10}`);
      path.setAttribute("stroke", isAlert ? "#c23b3b" : "#8a8f84");
      path.setAttribute("stroke-width", 1.5);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-dasharray", isAlert ? "4 3" : "none");
      NODE.appendChild(path);
    }
  }
  const legend = document.createElementNS(SVGNS, "g");
  legend.setAttribute("transform", `translate(${pad}, ${NODE.clientHeight - bottom + 10})`);
  const leg1 = document.createElementNS(SVGNS, "circle");
  leg1.setAttribute("r", 7);
  leg1.setAttribute("fill", "#35d07f");
  leg1.setAttribute("stroke-width", 2);
  leg1.setAttribute("stroke", "#ffffff");
  legend.appendChild(leg1);
  const lt1 = document.createElementNS(SVGNS, "text");
  lt1.setAttribute("x", 18);
  lt1.setAttribute("y", 5);
  lt1.setAttribute("font-size", "11");
  lt1.setAttribute("font-family", "system-ui, sans-serif");
  lt1.setAttribute("fill", "#232a23");
  lt1.textContent = "Normal";
  legend.appendChild(lt1);
  const leg2 = document.createElementNS(SVGNS, "circle");
  leg2.setAttribute("cx", 86);
  leg2.setAttribute("r", 7);
  leg2.setAttribute("fill", "#c23b3b");
  leg2.setAttribute("stroke-width", 2);
  leg2.setAttribute("stroke", "#ffffff");
  legend.appendChild(leg2);
  const lt2 = document.createElementNS(SVGNS, "text");
  lt2.setAttribute("x", 104);
  lt2.setAttribute("y", 5);
  lt2.setAttribute("font-size", "11");
  lt2.setAttribute("font-family", "system-ui, sans-serif");
  lt2.setAttribute("fill", "#232a23");
  lt2.textContent = "Alert / Detection";
  legend.appendChild(lt2);
  NODE.appendChild(legend);
  const cmds = [{"label": "CAM 01 · Camera 01 · Normal", "src": CCTV_SOURCES[0].src, "offset": 0, "speed": 1},
                {"label": "CAM 02 · Camera 02 · Chainsaw", "src": CCTV_SOURCES[0].src, "offset": 7, "speed": 1},
                {"label": "CAM 03 · Camera 03 · Vehicle", "src": CCTV_SOURCES[1].src, "offset": 0, "speed": 1},
                {"label": "CAM 04 · Camera 04 · Person", "src": CCTV_SOURCES[1].src, "offset": 9, "speed": 1},
                {"label": "CAM 05 · Camera 05 · Normal", "src": CCTV_SOURCES[2].src, "offset": 3, "speed": 1},
                {"label": "CAM 06 · Camera 06 · Vehicle", "src": CCTV_SOURCES[3].src, "offset": 0, "speed": 1}];
  const nodes = NODE.querySelectorAll(".cam-node");
  nodes.forEach((n, i) => {
    n.addEventListener("mouseenter", () => { n.querySelector("rect").setAttribute("stroke-dasharray","none"); n.querySelector("rect").setAttribute("stroke","#232a23"); });
    n.addEventListener("mouseleave", () => { n.querySelector("rect").setAttribute("stroke", feeds[i].status !== "normal" ? "#c23b3b" : "#35d07f"); n.querySelector("rect").setAttribute("stroke-dasharray", feeds[i].status !== "normal" ? "3 3" : "none"); });
    n.addEventListener("click", () => { if (!document.getElementById("modal").closest("#camGraphBlock")) { window.__ggOpenCamModal?.(cmds[i]); } });
  });
  window.__ggOpenCamModal = (cmd) => { const f = CCTV_FEEDS.find(f => f.src === cmd.src); if (f) openCCTVModal(f, f.src); };
}

/* ---------------- interactive camera graph ---------------- */
function initCamGraph() {
  const NODE = document.getElementById("camGraph");
  if (!NODE) return;
  const feeds = CCTV_FEEDS;
  const pad = 18, top = 26, bottom = 18, gap = 14;
  const w = NODE.clientWidth - pad * 2, h = NODE.clientHeight - top - bottom;
  const cols = 3, rows = Math.ceil(feeds.length / cols);
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows - 1)) / rows;
  const positions = feeds.map((f, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    return { x: pad + col * (cw + gap) + cw / 2, y: top + row * (ch + gap) + ch / 2 };
  });
  const SVGNS = "http://www.w3.org/2000/svg";
  // outer glow
  const bg = document.createElementNS(SVGNS, "rect");
  bg.setAttribute("x", 0); bg.setAttribute("y", 0); bg.setAttribute("width", NODE.clientWidth); bg.setAttribute("height", NODE.clientHeight);
  bg.setAttribute("fill", "none"); bg.setAttribute("rx", 14);
  NODE.appendChild(bg);
  const edges = document.createElementNS(SVGNS, "g");
  const rH = 32, rW = 56, rHead = 12;
  for (let i = 0; i < feeds.length; i++) {
    const a = positions[i];
    const isAlert = feeds[i].status !== "normal";
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${a.x},${a.y})`);
    g.setAttribute("class", "cam-node");
    // head circle
    const hdr = document.createElementNS(SVGNS, "circle");
    hdr.setAttribute("r", rHead);
    hdr.setAttribute("fill", isAlert ? "#e5484d" : "#35d07f");
    hdr.setAttribute("stroke", "#ffffff");
    hdr.setAttribute("stroke-width", 2);
    g.appendChild(hdr);
    // body rect
    const body = document.createElementNS(SVGNS, "rect");
    body.setAttribute("x", -rW / 2);
    body.setAttribute("y", rHead + 4);
    body.setAttribute("width", rW);
    body.setAttribute("height", rH);
    body.setAttribute("rx", 8);
    body.setAttribute("fill", isAlert ? "rgba(229,72,77,0.10)" : "rgba(53,208,127,0.08)");
    body.setAttribute("stroke", isAlert ? "#e5484d" : "#35d07f");
    body.setAttribute("stroke-width", 1.5);
    body.setAttribute("stroke-dasharray", isAlert ? "3 3" : "none");
    g.appendChild(body);
    // label line
    const line1 = document.createElementNS(SVGNS, "text");
    line1.setAttribute("y", rHead + 22);
    line1.setAttribute("text-anchor", "middle");
    line1.setAttribute("font-size", "10");
    line1.setAttribute("font-family", "system-ui, sans-serif");
    line1.setAttribute("fill", "#1a1a1a");
    line1.setAttribute("font-weight", 700);
    line1.textContent = feeds[i].name.replace(/ — /, " ·");
    g.appendChild(line1);
    const line2 = document.createElementNS(SVGNS, "text");
    line2.setAttribute("y", rHead + 38);
    line2.setAttribute("text-anchor", "middle");
    line2.setAttribute("font-size", "9");
    line2.setAttribute("font-family", "system-ui, sans-serif");
    line2.setAttribute("fill", "#5c5c5c");
    line2.textContent = CCTV_STATUS_TEXT[feeds[i].status];
    g.appendChild(line2);
    // rec pulse only on alert
    if (isAlert) {
      const ring = document.createElementNS(SVGNS, "circle");
      ring.setAttribute("r", rHead + 6);
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#e5484d");
      ring.setAttribute("stroke-width", 2);
      ring.setAttribute("opacity", 0.9);
      g.appendChild(ring);
      ring.setAttribute("class", "pulse-ring");
      g.appendChild(ring);
      const ring2 = g.querySelector("circle:last-of-type");
      if (ring2) ring2.setAttribute("class", "pulse-ring");
    }
    NODE.appendChild(g);
    // link line to next node
    if (i + 1 < feeds.length) {
      const b = positions[i + 1];
      const path = document.createElementNS(SVGNS, "path");
      const yMid = (a.y + b.y) / 2;
      path.setAttribute("d", `M${a.x},${a.y + rHead + 10} C${a.x},${yMid} ${b.x},${yMid} ${b.x},${b.y - rHead - 10}`);
      path.setAttribute("stroke", isAlert ? "#e5484d" : "#9aa09a");
      path.setAttribute("stroke-width", 1.5);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-dasharray", isAlert ? "4 3" : "none");
      NODE.appendChild(path);
    }
  }
  // simple legend
  const legend = document.createElementNS(SVGNS, "g");
  legend.setAttribute("transform", `translate(${pad}, ${NODE.clientHeight - bottom + 10})`);
  const leg1 = document.createElementNS(SVGNS, "circle");
  leg1.setAttribute("r", 7);
  leg1.setAttribute("fill", "#35d07f");
  leg1.setAttribute("stroke-width", 2);
  leg1.setAttribute("stroke", "#ffffff");
  legend.appendChild(leg1);
  const lt1 = document.createElementNS(SVGNS, "text");
  lt1.setAttribute("x", 18);
  lt1.setAttribute("y", 5);
  lt1.setAttribute("font-size", "11");
  lt1.setAttribute("font-family", "system-ui, sans-serif");
  lt1.setAttribute("fill", "#333333");
  lt1.textContent = "Normal";
  legend.appendChild(lt1);
  const leg2 = document.createElementNS(SVGNS, "circle");
  leg2.setAttribute("cx", 86);
  leg2.setAttribute("r", 7);
  leg2.setAttribute("fill", "#e5484d");
  leg2.setAttribute("stroke-width", 2);
  leg2.setAttribute("stroke", "#ffffff");
  legend.appendChild(leg2);
  const lt2 = document.createElementNS(SVGNS, "text");
  lt2.setAttribute("x", 104);
  lt2.setAttribute("y", 5);
  lt2.setAttribute("font-size", "11");
  lt2.setAttribute("font-family", "system-ui, sans-serif");
  lt2.setAttribute("fill", "#333333");
  lt2.textContent = "Alert / Detection";
  legend.appendChild(lt2);
  NODE.appendChild(legend);
  // hover behavior
  const cmds = [{"label": "CAM 01 · Forest Edge · Normal", "src": CCTV_SOURCES[0].src, "offset": 0, "speed": 1},
                {"label": "CAM 02 · Trail Entrance · Chainsaw", "src": CCTV_SOURCES[0].src, "offset": 7, "speed": 1},
                {"label": "CAM 03 · Perimeter Road · Vehicle", "src": CCTV_SOURCES[1].src, "offset": 0, "speed": 1},
                {"label": "CAM 04 · Logging Trail · Person", "src": CCTV_SOURCES[1].src, "offset": 9, "speed": 1},
                {"label": "CAM 05 · Ridge Watch · Normal", "src": CCTV_SOURCES[2].src, "offset": 3, "speed": 1},
                {"label": "CAM 06 · Watering Point · Vehicle", "src": CCTV_SOURCES[3].src, "offset": 0, "speed": 1}];
  const nodes = NODE.querySelectorAll(".cam-node");
  nodes.forEach((n, i) => {
    n.addEventListener("mouseenter", () => { n.querySelector("rect").setAttribute("stroke-dasharray","none"); n.querySelector("rect").setAttribute("stroke","#111"); });
    n.addEventListener("mouseleave", () => { n.querySelector("rect").setAttribute("stroke", feeds[i].status !== "normal" ? "#e5484d" : "#35d07f"); n.querySelector("rect").setAttribute("stroke-dasharray", feeds[i].status !== "normal" ? "3 3" : "none"); });
    n.addEventListener("click", () => { if (!NODE.closest("#camGraphPopup") ) { window.__ggOpenCamModal?.(cmds[i]); } });
  });
  window.__ggOpenCamModal = (cmd) => {
    const f = CCTV_FEEDS[cmds.indexOf(cmd)];
    openCCTVModal(f, f.src);
  };
}
