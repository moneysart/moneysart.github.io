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
    let time = range(0, termTarget, 1)
    let paymentMade = Array.from({ length: time.length })
    let interestPaid = Array.from({ length: time.length })
    let principalPaid = Array.from({ length: time.length })
    let principalRemain = Array.from({ length: time.length })
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

}


function init() {

    calculate(elements)

}