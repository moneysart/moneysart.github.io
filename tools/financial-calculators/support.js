function getElement() {

    // array of groups of components
    let elementsLists = ['fv', 'pv']
    let elementsComponents = elementsLists.map(x => {
        return {
            'pv': document.getElementById(x + "_pv"),
            'fv': document.getElementById(x + "_fv"),
            'r': document.getElementById(x + "_r"),
            'p': document.getElementById(x + "_p"),
            'button': document.getElementById(x + "_button")
        }
    })
    
    // object of { group key : components }
    let elementsGroups = {}
    elementsLists.forEach((key, i) => elementsGroups[key] = elementsComponents[i])

    return elementsGroups
}


function calculate() {
    let key = this.id.split("_")[0]
    console.log(key)
    console.log(elementGroups[key])
}

  
// function rePlot() {

//     updateRec(elements)
//     chart.data.labels = ageRec
//     chart.data.datasets[0].data = wealthRec
//     chart.update()

// }


function init() {

    // updateRec(elements)

    // elements.map(e => e.addEventListener("change", rePlot))

    chart_fv = new Chart(ctx_fv, {
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

    chart_pv = new Chart(ctx_pv, {
        type: 'line',
        data: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          datasets: [{
            data: [,,,,,,,,,,100],
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
