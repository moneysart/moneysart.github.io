function getElement() {

    let elementPrincipal = document.getElementById("principal")
    let elementInterestRate = document.getElementById("interestRate")
    let elementTermTarget = document.getElementById("termTarget")
    let elementPayPeriodBase = document.getElementById("payPeriodBase")
    let elementPayPeriodExtra = document.getElementById("payPeriodExtra")
    let elementPayPeriodTotal = document.getElementById("payPeriodTotal")
    let elementInterestTotal = document.getElementById("interestTotal")
    let elementPaymentTotal = document.getElementById("paymentTotal")
    let elementTermActual = document.getElementById("termActual")
    let elementInterestSaved = document.getElementById("interestSaved")
    let elementTermSaved = document.getElementById("termSaved")


    return [elementPrincipal,
        elementInterestRate,
        elementTermTarget,
        elementPayPeriodBase,
        elementPayPeriodExtra,
        elementPayPeriodTotal,
        elementInterestTotal,
        elementPaymentTotal,
        elementTermActual,
        elementInterestSaved,
        elementTermSaved
    ]
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

}


function calculate(elements) {

    let principal = Number(elements[0].value)
    let interestRate = Number(elements[1].value) / 100.0;
    let termTarget = Number(elements[2].value)
    let elementPayPeriodBase = elements[3]
    let payPeriodExtra = Number(elements[4].value)
    let elementPayPeriodTotal = elements[5]
    let elementInterestTotal = elements[6]
    let elementPaymentTotal = elements[7]
    let elementTermActual = elements[8]
    let elementInterestSaved = elements[9]
    let elementTermSaved = elements[10]

    // calculate fixed values
    let payPeriodBase = principal / (1 - 1 / Math.pow(1 + interestRate / 12, termTarget)) * (interestRate / 12)
    let payPeriodTotal = payPeriodBase + payPeriodExtra

    // range values
    time = range(0, termTarget, 1)
    interestForPeriod = Array.from({ length: time.length })
    paymentPaidForPeriod = Array.from({ length: time.length })
    principalPaidForPeriod = Array.from({ length: time.length })
    interestPaid = Array.from({ length: time.length })
    paymentMade = Array.from({ length: time.length })
    principalPaid = Array.from({ length: time.length })
    principalRemain = Array.from({ length: time.length })

    // explicit calculation below offers very minor improvement 
    // on accuracy of the last `defaultPaymentPaidForPeriod` and `interestSaved`
    // by capturing rounding of the very small digits
    // because `payPeriodBase` is already a closed form
    // let defaultInterestForPeriod = Array.from({ length: time.length })
    // let defaultPaymentPaidForPeriod = Array.from({ length: time.length })
    // let defaultPrincipalPaidForPeriod = Array.from({ length: time.length })
    // let defaultInterestPaid = Array.from({ length: time.length })
    // let defaultPaymentMade = Array.from({ length: time.length })
    // let defaultPrincipalPaid = Array.from({ length: time.length })
    // let defaultPrincipalRemain = Array.from({ length: time.length })
    
    for (const i in time) {
        if (i == 0) {
            interestForPeriod[i] = undefined
            paymentPaidForPeriod[i] = undefined
            principalPaidForPeriod[i] = undefined
            interestPaid[i] = 0
            principalPaid[i] = 0
            paymentMade[i] = 0
            principalRemain[i] = principal

            // defaultInterestForPeriod[i] = undefined
            // defaultPaymentPaidForPeriod[i] = undefined
            // defaultPrincipalPaidForPeriod[i] = undefined
            // defaultInterestPaid[i] = 0
            // defaultPrincipalPaid[i] = 0
            // defaultPaymentMade[i] = 0
            // defaultPrincipalRemain[i] = principal
        }
        else {
            interestForPeriod[i] = principalRemain[i-1] * interestRate * 1 / 12
            paymentPaidForPeriod[i] = Math.min(payPeriodTotal, principalRemain[i-1] + interestForPeriod[i])
            principalPaidForPeriod[i] = paymentPaidForPeriod[i] - interestForPeriod[i]
            interestPaid[i] = interestPaid[i-1] + interestForPeriod[i]
            paymentMade[i] = paymentMade[i-1] + paymentPaidForPeriod[i]
            principalPaid[i] = principalPaid[i-1] + principalPaidForPeriod[i]
            principalRemain[i] = principalRemain[i-1] - principalPaidForPeriod[i]

            // defaultInterestForPeriod[i] = defaultPrincipalRemain[i-1] * interestRate * 1 / 12
            // defaultPaymentPaidForPeriod[i] = Math.min(payPeriodBase, defaultPrincipalRemain[i-1] + defaultInterestForPeriod[i])
            // defaultPrincipalPaidForPeriod[i] = defaultPaymentPaidForPeriod[i] - defaultInterestForPeriod[i]
            // defaultInterestPaid[i] = defaultInterestPaid[i-1] + defaultInterestForPeriod[i]
            // defaultPaymentMade[i] = defaultPaymentMade[i-1] + defaultPaymentPaidForPeriod[i]
            // defaultPrincipalPaid[i] = defaultPrincipalPaid[i-1] + defaultPrincipalPaidForPeriod[i]
            // defaultPrincipalRemain[i] = defaultPrincipalRemain[i-1] - defaultPrincipalPaidForPeriod[i]
        }

    }
    // console.log(interestForPeriod)
    // console.log(paymentPaidForPeriod)
    // console.log(principalPaidForPeriod)
    // console.log(interestPaid)
    // console.log(paymentMade)
    // console.log(principalPaid)
    // console.log(principalRemain)

    // update calculated values
    let interestTotal = Math.max(...interestPaid)
    let paymentTotal = principal + interestTotal
    let interestSaved = Math.max(0, payPeriodBase * termTarget - paymentTotal)
    // let defaultInterestTotal = Math.max(...defaultInterestPaid)
    // let defaultPaymentTotal = principal + defaultInterestTotal
    // let interestSaved = Math.max(0, defaultPaymentTotal - paymentTotal)
    let termActual = paymentPaidForPeriod.filter(x => x > 0).length
    let termSaved = termTarget - termActual
    elementPayPeriodBase.value = payPeriodBase.toFixed(0)
    elementPayPeriodTotal.value = payPeriodTotal.toFixed(0)
    elementInterestTotal.value = interestTotal.toFixed(0)
    elementPaymentTotal.value = paymentTotal.toFixed(0)
    elementTermActual.value = termActual
    elementInterestSaved.value = interestSaved.toFixed(0)
    elementTermSaved.value = termSaved

}


function rePlot() {

    calculate(elements)

    chart.data.labels = time
    chart.data.datasets[0].data = principalRemain
    chart.data.datasets[1].data = interestPaid
    chart.update()

}


function init() {

    calculate(elements)

    chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: time,
          datasets: [{
            data: principalRemain,
            label: "เงินต้นคงเหลือ",
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            fill: true,
            yAxisID: 'y'
          },
          {
            data: interestPaid,
            label: "รวมดอกเบี้ยจ่าย",
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            fill: false,
            yAxisID: 'y2'
          }]
        },
        options: {
          scales: {
              x: {
                  title: {
                      display: false,
                      text: "งวดชำระ (เดือน)",
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: "เงินต้นคงเหลือ"
                  },
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
              },
              y2: {
                title: {
                    display: true,
                    text: "รวมดอกเบี้ยจ่าย"
                },
                position: 'right',
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
                },
                // grid line settings
                grid: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
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
                          return 'งวดชำระ: ' + context[0].label
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