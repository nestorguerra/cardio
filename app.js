
document.getElementById("app").innerHTML = `
  <section class="card" id="cha2ds2">
    <h2>CHA<sup>2</sup>DS<sup>2</sup>-VASc</h2>
    <form id="chaForm">
      <label>Edad (años)</label>
      <input type="number" id="cha_age" required />
      <label>Sexo femenino</label>
      <select id="cha_sex"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Insuficiencia cardiaca</label>
      <select id="cha_hf"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Hipertensión</label>
      <select id="cha_htn"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Diabetes</label>
      <select id="cha_dm"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Stroke/TE previo</label>
      <select id="cha_stroke"><option value="0">No</option><option value="2">Sí</option></select>
      <label>Vascular (IAM/AOP/Placa)</label>
      <select id="cha_vasc"><option value="0">No</option><option value="1">Sí</option></select>
      <button type="submit">Calcular</button>
      <div class="result" id="cha_output"></div>
    </form>
    <h4>Histórico</h4>
    <table id="cha_history"><tr><th>Fecha</th><th>Punt.</th></tr></table>
  </section>
  <section class="card" id="hasbled">
    <h2>HAS-BLED</h2>
    <form id="hasbledForm">
      <label>Hipertensión (&gt;160 mmHg)</label>
      <select id="hb_htn"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Función renal alterada</label>
      <select id="hb_renal"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Función hepática alterada</label>
      <select id="hb_liver"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Stroke previo</label>
      <select id="hb_stroke"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Sangrado previo</label>
      <select id="hb_bleed"><option value="0">No</option><option value="1">Sí</option></select>
      <label>INR lábil / lab.</label>
      <select id="hb_inr"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Edad &gt;65</label>
      <select id="hb_age"><option value="0">No</option><option value="1">Sí</option></select>
      <label>Fármacos/alcohol</label>
      <select id="hb_drug"><option value="0">No</option><option value="1">Sí</option></select>
      <button type="submit">Calcular</button>
      <div class="result" id="hb_output"></div>
    </form>
    <h4>Histórico</h4>
    <table id="hb_history"><tr><th>Fecha</th><th>Punt.</th></tr></table>
  </section>
  <section class="card" id="killip">
    <h2>Killip-Kimball</h2>
    <form id="killipForm">
      <label>Clase Killip</label>
      <select id="killip_class">
        <option value="1">I – Sin IC</option>
        <option value="2">II – IC leve (S3, crepitantes)</option>
        <option value="3">III – Edema pulmonar</option>
        <option value="4">IV – Shock cardiogénico</option>
      </select>
      <button type="submit">Registrar</button>
      <div class="result" id="killip_output"></div>
    </form>
    <h4>Histórico</h4>
    <table id="killip_history"><tr><th>Fecha</th><th>Clase</th></tr></table>
  </section>
  <section class="card" id="grace">
    <h2>GRACE (ACS simplificado)</h2>
    <form id="graceForm">
      <label>Edad</label>
      <input type="number" id="gr_age" required />
      <label>FC (lpm)</label>
      <input type="number" id="gr_hr" required />
      <label>PAS (mmHg)</label>
      <input type="number" id="gr_sbp" required />
      <label>Creatinina (mg/dL)</label>
      <input type="number" step="0.01" id="gr_creat" required />
      <label>Killip</label>
      <select id="gr_killip">
        <option value="1">I</option>
        <option value="2">II</option>
        <option value="3">III</option>
        <option value="4">IV</option>
      </select>
      <button type="submit">Calcular</button>
      <div class="result" id="gr_output"></div>
    </form>
    <h4>Histórico</h4>
    <table id="gr_history"><tr><th>Fecha</th><th>Score</th></tr></table>
  </section>
`;
// Utilidades
function saveHistory(key, value) {
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  data.unshift(value);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 20)));
}
function loadHistory(key, tableId, formatter) {
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = `<tr><th>${tbody.rows[0].cells[0].innerText}</th><th>${tbody.rows[0].cells[1].innerText}</th></tr>`;
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${new Date(row.ts).toLocaleString()}</td><td>${formatter(row)}</td>`;
    tbody.appendChild(tr);
  });
}
// CHA2DS2-VASc
document.getElementById("chaForm").onsubmit = function(e){
  e.preventDefault();
  const age = +document.getElementById("cha_age").value;
  let score = 0;
  if (age >= 75) score += 2; else if (age >= 65) score += 1;
  score += +document.getElementById("cha_sex").value;
  score += +document.getElementById("cha_hf").value;
  score += +document.getElementById("cha_htn").value;
  score += +document.getElementById("cha_dm").value;
  score += +document.getElementById("cha_stroke").value;
  score += +document.getElementById("cha_vasc").value;
  document.getElementById("cha_output").innerText = `Puntuación: ${score}`;
  saveHistory("cha", { ts: Date.now(), score });
  loadHistory("cha", "cha_history", r => r.score);
}; loadHistory("cha", "cha_history", r => r.score);
// HAS-BLED
document.getElementById("hasbledForm").onsubmit = function(e){
  e.preventDefault();
  let score = 0;
  ["hb_htn","hb_renal","hb_liver","hb_stroke","hb_bleed","hb_inr","hb_age","hb_drug"].forEach(id => score += +document.getElementById(id).value);
  document.getElementById("hb_output").innerText = `Puntuación: ${score}`;
  saveHistory("hb", { ts: Date.now(), score });
  loadHistory("hb", "hb_history", r => r.score);
}; loadHistory("hb", "hb_history", r => r.score);
// Killip-Kimball
document.getElementById("killipForm").onsubmit = function(e){
  e.preventDefault();
  const cls = document.getElementById("killip_class").value;
  document.getElementById("killip_output").innerText = `Clase ${cls}`;
  saveHistory("killip", { ts: Date.now(), cls });
  loadHistory("killip", "killip_history", r => r.cls);
}; loadHistory("killip", "killip_history", r => r.cls);
// GRACE
document.getElementById("graceForm").onsubmit = function(e){
  e.preventDefault();
  const age = +document.getElementById("gr_age").value;
  const hr = +document.getElementById("gr_hr").value;
  const sbp = +document.getElementById("gr_sbp").value;
  const creat = +document.getElementById("gr_creat").value;
  const killip = +document.getElementById("gr_killip").value;
  const score = Math.round(age*0.8 + hr*0.2 + (180-sbp)*0.5 + creat*15 + killip*20);
  document.getElementById("gr_output").innerText = `Score aproximado: ${score}`;
  saveHistory("grace", { ts: Date.now(), score });
  loadHistory("grace", "gr_history", r => r.score);
}; loadHistory("grace", "gr_history", r => r.score);
