function getElement() {

    let elementPrincipal = document.getElementById("principal")
    let elementInterestRate = document.getElementById("interestRate")
    let elementTermTarget = document.getElementById("termTarget")
    let elementPayPeriodBase = document.getElementById("payPeriodBase")
    let elementInterestTotal = document.getElementById("interestTotal")
    let elementPaymentTotal = document.getElementById("paymentTotal")


    return [elementPrincipal,
        elementInterestRate,
        elementTermTarget,
        elementPayPeriodBase,
        elementInterestTotal,
        elementPaymentTotal
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
    let elementInterestTotal = elements[4]
    let elementPaymentTotal = elements[5]

    // calculate fixed values
    let interestTotal = principal * interestRate * (termTarget / 12)  // normalized termTarget to year
    let payPeriodBase = (principal + interestTotal) / termTarget
    let interestForPeriod = interestTotal / termTarget
    let principalPayForPeriod = payPeriodBase - interestForPeriod
    let paymentTotal = principal + interestTotal
    
    // range values
    time = range(0, termTarget, 1)
    paymentMade = Array.from({ length: time.length })
    interestPaid = Array.from({ length: time.length })
    principalPaid = Array.from({ length: time.length })
    principalRemain = Array.from({ length: time.length })
    for (const i in time) {
        if (i == 0) {
            paymentMade[i] = 0
            interestPaid[i] = 0
            principalPaid[i] = 0
            principalRemain[i] = principal
        }
        else {
            paymentMade[i] = Math.min(paymentTotal, paymentMade[i-1] + payPeriodBase)
            interestPaid[i] = Math.min(interestTotal, interestPaid[i-1] + interestForPeriod)
            principalPaid[i] = Math.min(principal, principalPaid[i-1] + principalPayForPeriod)
            principalRemain[i] = Math.max(0, principalRemain[i-1] - principalPayForPeriod)
        }
    }
    // console.log(paymentMade)
    // console.log(interestPaid)
    // console.log(principalPaid)
    // console.log(principalRemain)

    // update calculated values
    elementPayPeriodBase.value = payPeriodBase.toFixed(0)
    elementInterestTotal.value = interestTotal.toFixed(0)
    elementPaymentTotal.value = paymentTotal.toFixed(0)

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