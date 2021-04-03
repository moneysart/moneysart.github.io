function getElement() {

    let elementAgeNow = document.getElementById("ageNow")
    let elementAgeRetired = document.getElementById("ageRetired")
    let elementAgeUntil = document.getElementById("ageUntil")
    let elementSeed = document.getElementById("seed")
    let elementMonthInc = document.getElementById("mIncome")
    let elementMonthExp = document.getElementById("mExpenses")
    let elementReturnRate = document.getElementById("returnRate")
    let elementReturnRateRetired = document.getElementById("returnRateRetired")

    return [elementAgeNow,
      elementAgeRetired,
      elementAgeUntil,
      elementSeed,
      elementMonthInc,
      elementMonthExp,
      elementReturnRate,
      elementReturnRateRetired]
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
    if (this.max && Number(this.value) > Number(this.max)) {
      alert(lableText + " has to be <= " + this.max)
      this.value = this.max
    }

    if (this.id === "ageNow") {
      let elementAgeRetired = document.getElementById("ageRetired")
      if (Number(elementAgeRetired.value) < Number(this.value)) { elementAgeRetired.value = Number(this.value) }

      let elementAgeUntil = document.getElementById("ageUntil")
      if (Number(elementAgeUntil.value) < Number(elementAgeRetired.value) + 1) { elementAgeUntil.value = Number(elementAgeRetired.value) + 1 }
    }

    if (this.id === "ageRetired") {
      let elementAgeNow = document.getElementById("ageNow")
      if (Number(elementAgeNow.value) > Number(this.value)) { elementAgeNow.value = Number(this.value) }

      let elementAgeUntil = document.getElementById("ageUntil")
      if (Number(elementAgeUntil.value) < Number(this.value) + 1) { elementAgeUntil.value = Number(this.value) + 1 }
    }

    if (this.id === "ageUntil") {
      let elementAgeNow = document.getElementById("ageNow")
      if (Number(elementAgeNow.value) > Number(this.value) - 1) { elementAgeNow.value = Number(this.value) - 1 }

      let elementAgeRetired = document.getElementById("ageRetired")
      if (Number(elementAgeRetired.value) > Number(this.value) - 1) { elementAgeRetired.value = Number(this.value) - 1 }
    }

}


function updateRec(elements) {

    let ageNow = parseInt(elements[0].value)
    let ageRetired = parseInt(elements[1].value)
    let ageUntil = parseInt(elements[2].value)
    let seed = parseInt(elements[3].value)
    let inc = 12 * parseInt(elements[4].value)
    let exp = 12 * parseInt(elements[5].value)
    let r = 1 + Number(elements[6].value) / 100.0
    let r_saving = 1 + Number(elements[6].value) / 100.0 / 2  // average return for monthly saving over the year ~ annualReturn / 2
    let r_retired = 1 + Number(elements[7].value) / 100.0

    let ageWork = range(ageNow, ageRetired, 1)
    let ageSpend = range(ageRetired + 1, ageUntil, 1)

    let wealthWork = Array.from({ length: ageWork.length })
    wealthWork[0] = seed
    wealthWork.slice(1).forEach((e, i) => {
      let saving = inc - exp
      let savingGrowth = (saving > 0 ? saving * r_saving : saving)    // saving grows if positive, otherwise remains the same
      let seed = wealthWork[i] + (saving > 0 ? 0 : saving)            // seed is reduced if saving is negative, otherwise remains the same
      let seedGrowth = (seed > 0 ? seed * r : seed)                   // seed grows if positive, otherwise remains the same
      let netYearEnd = savingGrowth + seedGrowth
      wealthWork[i + 1] = netYearEnd
    })

    let wealthCarry = wealthWork[wealthWork.length - 1] - exp         // wealth at the beginning of 1st year of retirement after reserving for annual expenses
    let wealthSpend = Array.from({ length: ageSpend.length })
    wealthSpend[0] = (wealthCarry > 0 ? wealthCarry * r_retired : wealthCarry)    // wealth at the end of 1st year of retirement
    wealthSpend.slice(1).forEach((e, i) => {
      let remain = (wealthSpend[i] - exp)                             // remaining wealth at the beginning of year after reserving for annual expenses
      let remainGrowth = (remain > 0 ? remain * r_retired : remain)   // remaining wealth at the end of year
      wealthSpend[i + 1] = remainGrowth
    })

    ageRec = ageWork.concat(ageSpend)
    wealthRec = wealthWork.concat(wealthSpend)
    // console.log(ageWork)
    // console.log(ageSpend)
    // console.log(ageRec)
    // console.log(wealthWork)
    // console.log(wealthSpend)
    // console.log(wealthRec)
}

  
function rePlot() {

    updateRec(elements)
    chart.data.labels = ageRec
    chart.data.datasets[0].data = wealthRec
    chart.update()

}


function init() {

    updateRec(elements)

    // elements.map(e => e.addEventListener("change", rePlot))
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ageRec,
        datasets: [{
          data: wealthRec,
          label: "Wealth (สินทรัพย์)",
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
