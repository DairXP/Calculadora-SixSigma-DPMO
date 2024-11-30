let sigmaChart;

function initSigmaChart() {
    const ctx = document.getElementById('sigmaChart').getContext('2d');
    sigmaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Nivel alcanzado', 'Restante'],
            datasets: [{
                data: [0, 6], // Inicialmente, 0 alcanzado y 6 restante
                backgroundColor: ['#E0E0E0', '#E0E0E0'], // Colores iniciales (gris)
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            },
            cutout: '70%',
            rotation: -90, // Comienza desde la parte superior
            circumference: 180, // Semicírculo
        }
    });
}

function updateSigmaChart(sigma) {
    if (sigmaChart) {
        const remaining = 6 - sigma; // Calcular el restante
        sigmaChart.data.datasets[0].data = [sigma, remaining];
        sigmaChart.data.datasets[0].backgroundColor = [
            sigma < 3 ? '#ff4444' : sigma < 4 ? '#ffbb33' : sigma < 5 ? '#33b5e5' : '#00C851', // Color dinámico
            '#E0E0E0'
        ];
        sigmaChart.update();
    }
}

document.addEventListener('DOMContentLoaded', initSigmaChart);
