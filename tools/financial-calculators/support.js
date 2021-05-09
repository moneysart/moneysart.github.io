let range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))


function getElement() {

    // store elements to group 
    let elementsComponents = elementsLists.map(x => {
        return {
            'pv': document.getElementById(x + "_pv"),
            'fv': document.getElementById(x + "_fv"),
            'r': document.getElementById(x + "_r"),
            'p': document.getElementById(x + "_p"),
            'button': document.getElementById(x + "_button"),
            'canvas': document.getElementById(x + "_canvas")
        }
    })
    
    // object of { group key : components }
    let elementsGroups = {}
    elementsLists.forEach((key, i) => elementsGroups[key] = elementsComponents[i])

    return elementsGroups
}


function reCalculate() {

    // get key of pressed button
    let key = this.id.split("_")[0]
    // console.log(key)


    let pv, p, r, fv 
    // calculate selected key
    if (key==='fv') {
        pv = Number(elementsGroups[key]['pv'].value)
        r  = Number(elementsGroups[key]['r'].value) / 100
        p  = Number(elementsGroups[key]['p'].value)
        fv = pv * Math.pow(1 + r, p)
        elementsGroups[key][key].value = fv.toFixed(2)
    }
    if (key==='pv') {
        fv = Number(elementsGroups[key]['fv'].value)
        r  = Number(elementsGroups[key]['r'].value) / 100
        p  = Number(elementsGroups[key]['p'].value)
        pv = fv / Math.pow(1 + r, p)
        elementsGroups[key][key].value = pv.toFixed(2)
    }
    if (key==='r') {
        pv = Number(elementsGroups[key]['fv'].value)
        fv = Number(elementsGroups[key]['fv'].value)
        p  = Number(elementsGroups[key]['p'].value)
        r  = 100 * (Math.pow( fv / pv, 1/p ) - 1)
        elementsGroups[key][key].value = r.toFixed(2)
    }
    if (key==='p') {
        pv = Number(elementsGroups[key]['fv'].value)
        fv = Number(elementsGroups[key]['fv'].value)
        r  = Number(elementsGroups[key]['r'].value) / 100
        p  = Math.log( fv / pv ) / Math.log( 1 + r )
        elementsGroups[key][key].value = p.toFixed(2)
    }


    // update chart of selected key
    let periodRange = range(0, Math.ceil(p), 1)
    let valRange = periodRange.map(p => pv * Math.pow(1 + r, p))

    updateChart(key, periodRange, valRange)
}


function updateChart(key, periodRange, valRange) {
    let chart = elementsGroups[key]['chart']
    chart.data.labels = periodRange
    chart.data.datasets[0].data = valRange
    chart.update()
}


function init_chart() {

    elementsLists.forEach(key => {

        // create chart for each tab
        let chart = new Chart(elementsGroups[key]['canvas'], {
            type: 'line',
            data: {
                labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                datasets: [{
                    data: [100],
                    label: "Value over time",
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Period",
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Value"
                        },
                        ticks: {
                            // Re-label tick
                            callback: function (value, index, values) {
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
                                    return Number(y_value / k).toFixed(2) + 'k'
                                }

                                return Number(y_value).toFixed(2)
                            },
                            // re-label tooltip
                            title: function (context) {
                                return 'Period: ' + context[0].label
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
                aspectRatio: 2.8,
                maintainAspectRatio: true,
            }
        })
        elementsGroups[key]['chart'] = chart
    })

}
