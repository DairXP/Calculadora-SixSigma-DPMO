// static/js/main.js
let timeout = null;

function updateResults() {
    const defects = document.getElementById('defects').value || 0;
    const units = document.getElementById('units').value || 0;
    const opportunities = document.getElementById('opportunities').value || 0;

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defects, units, opportunities })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('error-message').textContent = data.error;
            document.getElementById('error-message').style.display = 'block';
            return;
        }
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('sigma').textContent = data.sigma;
        document.getElementById('yield').textContent = data.yield + '%';
        document.getElementById('defects_percent').textContent = data.defects_percent + '%';
        document.getElementById('dpmo').textContent = data.dpmo.toLocaleString();
        document.getElementById('rty').textContent = data.rty + '%';
        document.getElementById('defective_units').textContent = data.defective_units + '%';
        document.getElementById('dpm').textContent = data.dpm.toLocaleString();
    })
    .catch(error => {
        document.getElementById('error-message').textContent = 'Error en el cálculo';
        document.getElementById('error-message').style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    ['defects', 'units', 'opportunities'].forEach(id => {
        const input = document.getElementById(id);
        input.value = id === 'defects' ? '10' : id === 'units' ? '100' : '3';
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateResults, 500);
        });
    });

    updateResults();
});