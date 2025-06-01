document.addEventListener('DOMContentLoaded', async () => {
  await mostrarVentasPorUsuario();
  await mostrarProductosMasVendidos();
  await mostrarTotalPorUsuario();
});

async function mostrarVentasPorUsuario() {
  try {
    const res = await fetch('/estadisticas/ventas-por-usuario');
    const data = await res.json();

    const nombres = data.map(item => item.Usuario.nombre);
    const totales = data.map(item => parseInt(item.totalVentas));

    const colores = [
      '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0',
      '#9966ff', '#ff9f40', '#c9cbcf', '#6e6eff'
    ];

    const backgroundColors = nombres.map((_, i) => colores[i % colores.length]);

    const ctx = document.getElementById('grafica-mis-ventas').getContext('2d');

    if (window.graficoVentasPorUsuario) {
      window.graficoVentasPorUsuario.destroy();
    }

    window.graficoVentasPorUsuario = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Ventas por Vendedor',
          data: totales,
          backgroundColor: backgroundColors,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#fff' // color de texto del eje Y
            },
            grid: {
              color: '#555' // líneas del eje Y
            },
            title: {
              display: true,
              text: 'Cantidad de Ventas',
              color: '#fff',
              font: {
                size: 14
              }
            }
          },
          x: {
            ticks: {
              color: '#fff' // texto del eje X
            },
            grid: {
              color: '#555'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Total de Ventas por Usuario',
            color: '#fff',
            font: {
              size: 20
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: context => {
                const valor = context.raw;
                return `${context.label}: ${valor} ventas`;
              }
            },
            backgroundColor: '#2c3e50',
            titleColor: '#ecf0f1',
            bodyColor: '#ecf0f1',
            borderColor: '#34495e',
            borderWidth: 1
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 30
            },
            anchor: 'end',
            align: 'start',
            formatter: value => value
          }
        }
      },
      plugins: [ChartDataLabels]
    });

  } catch (err) {
    console.error('Error al cargar ventas por usuario:', err);
  }
}


async function mostrarProductosMasVendidos() {
  try {
    const res = await fetch('/estadisticas/productos-mas-vendidos');
    const data = await res.json();

    const nombres = data.map(item => item.Producto.nombre);
    const cantidades = data.map(item => parseInt(item.cantidadTotal));
    const total = cantidades.reduce((acc, val) => acc + val, 0);

    const colores = [
      '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'
    ];

    const ctx = document.getElementById('grafica-mis-productos').getContext('2d');

    if (window.graficoProductos) {
      window.graficoProductos.destroy();
    }

    window.graficoProductos = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: nombres,
        datasets: [{
          data: cantidades,
          backgroundColor: colores,
          borderColor: '#2c3e50',
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#ecf0f1',
              font: {
                size: 14
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Productos Más Vendidos',
            color: '#ecf0f1',
            font: {
              size: 20
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const porcentaje = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} ventas (${porcentaje}%)`;
              }
            },
            backgroundColor: '#2c3e50',
            titleColor: '#ecf0f1',
            bodyColor: '#ecf0f1',
            borderColor: '#34495e',
            borderWidth: 1
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 13
            },
            formatter: (value) => {
              const porcentaje = (value / total * 100).toFixed(1);
              return `${porcentaje}%`;
            }
          }
        },
        layout: {
          padding: 20
        }
      },
      plugins: [ChartDataLabels]
    });

  } catch (err) {
    console.error('Error al cargar productos más vendidos:', err);
  }
}

async function mostrarTotalPorUsuario() {
  try {
    const res = await fetch('/estadisticas/total-por-usuario');
    const data = await res.json();

    const nombres = data.map(item => item.Usuario.nombre);
    const totales = data.map(item => parseFloat(item.totalGenerado));

    const ctx = document.getElementById('totalGeneradoPorUsuario').getContext('2d');

    if (window.graficoTotalGenerado) {
      window.graficoTotalGenerado.destroy();
    }

    window.graficoTotalGenerado = new Chart(ctx, {
      type: 'line',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Total Generado ($)',
          data: totales,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 0.8)',
          backgroundColor: 'rgba(255, 99, 132, 1)',
          tension: 0.3,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#fff'
            },
            grid: {
              color: '#444'
            },
            title: {
              display: true,
              text: 'Total en USD',
              color: '#fff',
              font: {
                size: 14
              }
            }
          },
          x: {
            ticks: {
              color: '#fff'
            },
            grid: {
              color: '#444'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff'
            }
          },
          title: {
            display: true,
            text: 'Total de Dinero Generado por Usuario',
            color: '#fff',
            font: {
              size: 20
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: '#2c3e50',
            titleColor: '#ecf0f1',
            bodyColor: '#ecf0f1',
            borderColor: '#e74c3c',
            borderWidth: 1,
            callbacks: {
              label: ctx => `$${ctx.raw.toFixed(2)} generados`
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              size: 14,
              weight: 'bold'
            },
            align: 'top',
            anchor: 'end',
            formatter: val => `$${val.toFixed(2)}`
          }
        }
      },
      plugins: [ChartDataLabels]
    });

  } catch (err) {
    console.error('Error al cargar total por usuario:', err);
  }
}

