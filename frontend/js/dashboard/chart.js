document.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('grafica-mis-ventas').getContext('2d');

  try {
    const res = await fetch('/chart/ventas-mensuales');
    const data = await res.json();

    if (!data.ok) {
      throw new Error(data.error || 'No se pudo cargar la información');
    }

    // Convertir fechas y preparar datos
    const labels = data.datos.map(item => {
      const fecha = new Date(item.mes);
      return fecha.toLocaleString('es-EC', { month: 'long', year: 'numeric' });
    });

    const valores = data.datos.map(item => item.total);

    // Crear gráfica
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Ventas Totales ($)',
          data: valores,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ventas Totales por Mes'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `$${context.formattedValue}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => `$${value}`
            }
          }
        }
      }
    });

  } catch (err) {
    console.error('Error al cargar la gráfica:', err);
    alert('Error al cargar estadísticas. Ver consola.');
  }
});
