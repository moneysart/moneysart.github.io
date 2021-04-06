function getElement() {

    let elementCapital = document.getElementById("capital")
    let elementReturnRate = document.getElementById("returnRate")
    let elementPeriod = document.getElementById("period")
    let elementFinal = document.getElementById("final")

    return [elementCapital,
        elementReturnRate,
        elementPeriod,
        elementFinal]
}


function calculate(elements) {

    let capital = elements[0].value
    let r = 1 + Number(elements[1].value) / 100.0;
    let period = parseInt(elements[2].value);
    let elementFinal = elements[3]

    // calculate time and vaues arrays
    time = range(0, period, 1)
    values = Array.from(time, t => capital * Math.pow(r, t))

    // update final amount
    elementFinal.value = values[values.length - 1].toFixed(2)

}


function rePlot() {

    calculate(elements)
    chart.data.labels = time
    chart.data.datasets[0].data = values
    chart.update()

}


function init() {

    calculate(elements)

    // elements.map(e => e.addEventListener("change", rePlot))
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: time,
        datasets: [{
          data: values,
          label: "Wealth (สินทรัพย์)",
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          fill: true
        }]
      },
      options: {
        scales: {
            y: {
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
                        return 'Year: ' + context[0].label
                    }
                }
            },
            legend: {
                display: true,
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
