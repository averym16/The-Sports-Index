// script.js
const tbody = document.getElementById('league_body');
const DATA_URL = '../data/leagues.json'; // relative path to JSON

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadAndRender() {
  try {
    const res = await fetch(DATA_URL, {cache: "no-store"});
    if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status} ${res.statusText}`);
    const data = await res.json();

    // Clear existing rows
    tbody.innerHTML = '';

    // Validate it's an array
    if (!Array.isArray(data)) {
      throw new Error('JSON root is not an array');
    }


    data.forEach(item => {
      const tr = document.createElement('tr');
      const filter = data.filter(item => item.region === "north_hemisphere");
      data.forEach(filter => {
        const league= escapeHtml(filter.league ?? '');
        const description = escapeHtml(filter.description ?? '');
        const season = escapeHtml(filter.season ?? '');
        const schedule_name = escapeHtml(filter.schedule_name ?? '');
        const schedule_link = escapeHtml(filter.schedule_link ?? '');
        const watch = escapeHtml(filter.watch ?? '');
        const teams = escapeHtml(filter.teams ?? '');

        tr.innerHTML = /*html*/`
          <td>${league}</td>
          <td>${description}</td>
          <td>${season}</td>
          <td>${teams}</td>
          <td><a href="${schedule_link}" target="_blank">${schedule_name}</a></td>
          <td>${watch}</td>
        `;

        tbody.appendChild(tr);
      });
    });

  } catch (err) {
    console.error(err);
    // show a friendly message in the table
    tbody.innerHTML = `<tr><td colspan="4">Error loading data: ${escapeHtml(err.message)}</td></tr>`;
  }
}

// Run on load
loadAndRender();
