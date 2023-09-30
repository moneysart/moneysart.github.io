function init() {


    // elements.map(e => e.addEventListener("change", rePlot))
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [1,2,3],
        datasets: [{
          data: [1,2,3],
          label: "None",
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          fill: true
        }]
      },
      options: {
        scales: {
            // x: {
            //     title: {
            //         display: true,
            //         text: "Age (อายุ)",
            //     }
            // },
            y: {
                // title: {
                //     display: true,
                //     text: "Net Worth"
                // },
                ticks: {
                    // Re-label tick
                    callback: function(value, index, values) {
                        let mil = 1000000
                        if (Math.abs(value) >= mil) {
                        return Number(value / mil) + 'Mil'
                        }

                        let k = 1000
                        if (Math.abs(value) >= k) {
                        return Number(value / k) + 'k'
                        }
                        
                        return Number(value).toFixed(0)
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    // re-label tooltip
                    label: function (context) {
                        let y_value = context.parsed.y
                      
                        let mil = 1000000
                        if (Math.abs(y_value) >= mil) {
                            return Number(y_value / mil).toFixed(2) + ' Million'
                        }
        
                        let k = 1000
                        if (Math.abs(y_value) >= k) {
                            return Number(y_value / k).toFixed(1) + 'k'
                        }
                      
                        return Number(y_value).toFixed(0)
                    },
                    // re-label tooltip
                    title: function(context) {
                        return 'Age: ' + context[0].label
                    }
                }
            },
            legend: {
                display: false,
                position: 'bottom',
                align: 'start'
            }
        },
        // responsive: true,
        aspectRatio: 3,
        maintainAspectRatio: true,
      }
    })
}