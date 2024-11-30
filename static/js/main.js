let timeout = null;

function getInterpretation(data) {
    return `
        <h3>1. Nivel Sigma (${data.sigma})</h3>
        <p><strong>Significado:</strong> El nivel Sigma indica que el proceso está operando con ${data.sigma} desviaciones estándar sobre la media.</p>
        <p><strong>Interpretación:</strong> ${
            data.sigma < 3 ? "Proceso necesita mejoras significativas." :
            data.sigma < 4 ? "Proceso por encima del promedio con espacio para mejora." :
            data.sigma < 5 ? "Buen control de proceso." :
            "Proceso de alta calidad."
        }</p>

        <h3>2. Rendimiento (${data.yield}%)</h3>
        <p><strong>Interpretación:</strong> ${data.yield}% de las unidades cumplen especificaciones.</p>

        <h3>3. Defectos (${data.defects_percent}%)</h3>
        <p><strong>Interpretación:</strong> ${data.defects_percent} de cada 100 unidades presentan defectos.</p>

        <h3>4. DPMO (${data.dpmo.toLocaleString()})</h3>
        <p><strong>Interpretación:</strong> Se esperan ${data.dpmo.toLocaleString()} defectos por millón de oportunidades.</p>

        <h3>5. RTY (${data.rty}%)</h3>
        <p><strong>Interpretación:</strong> ${data.rty}% de unidades completan el proceso sin defectos.</p>

        <h3>6. Unidades defectuosas (${data.defective_units}%)</h3>
        <p><strong>Interpretación:</strong> ${data.defective_units}% de unidades tienen al menos un defecto.</p>

        <h3>7. DPM (${data.dpm.toLocaleString()})</h3>
        <p><strong>Interpretación:</strong> ${data.dpm.toLocaleString()} defectos por millón de unidades producidas.</p>
    `;
}

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

        // Actualizar métricas
        document.getElementById('sigma').textContent = data.sigma;
        document.getElementById('yield').textContent = data.yield + '%';
        document.getElementById('defects_percent').textContent = data.defects_percent + '%';
        document.getElementById('dpmo').textContent = data.dpmo.toLocaleString();
        document.getElementById('rty').textContent = data.rty + '%';
        document.getElementById('defective_units').textContent = data.defective_units + '%';
        document.getElementById('dpm').textContent = data.dpm.toLocaleString();

        // Actualizar interpretación
        document.getElementById('interpretation').innerHTML = getInterpretation(data);

        // Dibujar gráfico Sigma
        if (data.sigma) {
            updateSigmaChart(data.sigma);
        }
    })
    .catch(error => {
        document.getElementById('error-message').textContent = 'Error en el cálculo';
        document.getElementById('error-message').style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['defects', 'units', 'opportunities'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateResults, 500);
        });
    });
});
