function getElement() {

    let elementCapital = document.getElementById("capital")
    let elementSaving = document.getElementById("saving")
    let elementReturnRate = document.getElementById("returnRate")
    let elementPeriod = document.getElementById("period")
    let elementFinal = document.getElementById("final")

    return [elementCapital,
        elementSaving,
        elementReturnRate,
        elementPeriod,
        elementFinal]
}


function validateVal() {

    // console.log(this.id)
    let lableText = document.getElementById(this.id).labels[0].textContent
    // console.log(lableText)
    if (!this.value) { this.value = 0 }

    if (this.min && Number(this.value) < Number(this.min)) {
        alert(lableText + " has to be >= " + this.min)
        this.value = this.min
    }

}


function calculate(elements) {

    let capital = Number(elements[0].value)
    let saving = Number(elements[1].value)
    let r = 1 + Number(elements[2].value) / 100.0
    let r_half = 1 + Number(elements[2].value) / 100.0 / 2  // average return for monthly saving over the year ~ annualReturn / 2
    let period = parseInt(elements[3].value)
    let elementFinal = elements[4]

    // calculate time and vaues arrays
    time = range(0, period, 1)
    
    values = Array.from({ length: time.length })
    values[0] = capital
    // iterate values from  i==1 to end
    values.slice(1).forEach((e, i) => {
        capitalGrowth = values[i] * r 
        savingGrowth = 12 * saving * r_half
        values[i + 1] = capitalGrowth + savingGrowth
    })
    // console.log(values)


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
