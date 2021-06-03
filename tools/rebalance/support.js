let UIController = (function () {
    let DOMStrings = {
        capital: '#capital',
        assetNum: '#asset__num',
        assetAdd: '#asset__add',
        assetRemove: '#asset__remove',
        assetList: '.asset__list',
        cValList: '.cVal__list',
        percentList: '.pct__list',
        tValList: '.tVal__list',
        actionList: '.act__list',
        // amountList: '.amt__list',
        assetItem: '.asset__item',
        cValItem: '.cVal__item',
        percentItem: '.pct__item',
        // amountItem: '.amt__item',
        cValSum: '#cVal-sum',
        percentSum: '#pct-sum',
        allocateButton: '#allocate'
    }

    let getNumAsset = function () {
        return parseInt(document.querySelector(DOMStrings.assetNum).value)
    }

    let roundPct = function (event) {
        let min = parseInt(event.target.min)
        let max = parseInt(event.target.max)
        let roundNum = Math.round(event.target.value)
        if (roundNum < min) {
            roundNum = min
        }
        else if (roundNum > max) {
            roundNum = max
        }
        event.target.value = roundNum
    }

    let sumPct = function () {
        let pctElements = document.querySelectorAll(DOMStrings.percentItem)
        let pctSum = Array.from(pctElements).map(e => parseInt(e.value)).reduce((acc, cur) => acc + cur)
        
        document.querySelector(DOMStrings.percentSum).value = pctSum
    }

    let sumCurVal = function () {
        let cValElements = document.querySelectorAll(DOMStrings.cValItem)
        let cValSum = Array.from(cValElements).map(e => parseInt(e.value)).reduce((acc, cur) => acc + cur)
        
        document.querySelector(DOMStrings.cValSum).value = cValSum
    }

    return {
        DOMStrings,

        getNumAsset,

        roundPct,

        sumPct,

        sumCurVal,

        addAsset: function () {

            // prepare id of the next item
            let id = getNumAsset() + 1

            // do not overdo it
            if (id <= 20) {
                // elements to insert form fields for asset's info 
                let parentElement = [DOMStrings.assetList, 
                    DOMStrings.cValList, 
                    DOMStrings.percentList, 
                    DOMStrings.tValList,
                    DOMStrings.actionList
                ]

                // html text to insert
                let html = [`
                <input id="asset-%id%" 
                class="form-control text-center my-1 asset__item" 
                type="text" value="สินทรัพย์นี้ดี-%id%" 
                placeholder="Place Your Asset Name"
                >
                `,
                    `
                <input id="cVal-%id%"
                class="form-control text-center my-1 cVal__item" 
                type="number"
                value="0" step=1000
                placeholder="มูลค่า">
                `,
                    `
                <input id="pct-%id%" class="form-control text-center my-1 pct__item" 
                type="number" 
                min=0 max=100 value="0" 
                placeholder="สัดส่วน เป็น %">
                `,
                    `
                <input id="tVal-%id%" class="form-control text-center my-1 tVal__item" 
                type="number" min=0 placeholder="???" 
                readonly style="background-color: white;">
                `,
                    `
                <div id="act-%id%" class="input-group my-1">
                    <div class="input-group-prepend" id="order-%id%">
                        <code class="input-group-text">B/S?</code>
                    </div>
                    <input type="number" class="form-control text-center" id="actVal-%id%" placeholder="???" readonly>
                </div>
                `,
                ]

                // insert HTML in DOM
                for (let i = 0; i < parentElement.length; i++) {
                    // replace placeholder text with actual data 
                    let newHtml = html[i].replace('%id%', id).replace('%id%', id)

                    // insert as a child, and at the end of the selected element
                    document.querySelector(parentElement[i]).insertAdjacentHTML('beforeend', newHtml)
                }

                // add addEventListener (roundPct and sumPct) to new #pct-id
                document.querySelector('#pct-' + id).addEventListener('change', roundPct)
                document.querySelector('#pct-' + id).addEventListener('change', sumPct)

                // add addEventListener sumCurVal to new #cVal-id
                document.querySelector('#cVal-' + id).addEventListener('change', sumCurVal)

                // update number of assets
                document.querySelector(DOMStrings.assetNum).value = id
            }
        },

        removeAsset: function () {

            // find the latest asset-id
            let id = getNumAsset()

            // always have at least 1 asset
            if (id > 1) {

                // delete an item based on asset-id
                let elements = [
                    document.getElementById("asset-" + id),
                    document.getElementById("cVal-" + id),
                    document.getElementById("pct-" + id),
                    document.getElementById("tVal-" + id),
                    document.getElementById("act-" + id)
                ]

                // JS does not allow remove an element directly
                // But we can ascend to the parent element and remove its child
                // console.log(elements)
                elements.forEach(e => e.parentNode.removeChild(e))

                // update number of assets
                document.querySelector(DOMStrings.assetNum).value = id - 1

                // update #pct-sum, #cVal-sum
                sumPct()
                sumCurVal()
            }
        }
    }
})()


let allocationCalculator = (function () {

    // function to get sum of target allocation
    let getSumAllocation = function (DOMpercentSum) {
        let sumAlct = parseInt(document.querySelector(DOMpercentSum).value)

        return sumAlct
    }

    // show alert message (rethink not to auto-update -- and update value of last #asset-lastID according to offset)
    let alertAllocation = function (sumAlct, lastID) {
        let offset = 100 - sumAlct
        let lastAsset = document.getElementById('asset-' + lastID).value
        let lastAssetPct = parseInt(document.getElementById('pct-' + lastID).value)

        let alertMessage = `
        ผลรวมสัดส่วนเป้าหมาย มีค่า ${sumAlct}%.
        กรุณาปรับผลรวมให้เป็น 100%.
        เช่น ปรับสัดส่วน ${lastAsset} เป็น ${lastAssetPct + offset}%.
        `

        alert(alertMessage)

        // fill suggested allocation for #asset-lastID, or 0 if negative
        // document.getElementById('pct-' + lastID).value = Math.max(0, lastAssetPct + offset)
    }

    return {
        allocateAsset: function (DOMpercentSum, DOMamountItem, lastID) {
            // get sum of target allocation
            let sumAlct = getSumAllocation(DOMpercentSum)

            // alert if total pct allocation !== 100, then exist calculation
            if (sumAlct !== 100) {
                alertAllocation(sumAlct, lastID)
                let elementAmt = document.querySelectorAll(DOMamountItem)
                elementAmt.forEach((e) => {
                    e.value = "???"
                })
                return;
            }

            // calculate amount to allocate
            let capital = Number(document.querySelector('#capital').value)
            let items = document.querySelectorAll(DOMamountItem)
            let temp = 0

            // update with pct until last #amt-id
            Array.from(items).slice(0, -1).forEach((e, i) => {
                let targetPct = Number(document.getElementById('pct-' + (i + 1)).value)
                let amt = Math.round(capital * targetPct / 100)
                e.value = amt
                temp = temp + amt
            })
            // update last #amt-id 
            items[lastID - 1].value = capital - temp
        }
    }
})()


let controller = (function (UICtrl, allocationCal) {

    // allocate assets according to target % allocation
    let allocateAssets = function () {
        allocationCal.allocateAsset(UICtrl.DOMStrings.percentSum, UICtrl.DOMStrings.amountItem, UICtrl.getNumAsset())
    }

    // function to add event listeners to HTML elements
    let setupEventListeners = function () {
        // get elements
        let elementPctVal = document.querySelectorAll(UICtrl.DOMStrings.percentItem)
        let elementCurrentVal = document.querySelectorAll(UICtrl.DOMStrings.cValItem)

        let elementAssetAdd = document.querySelector(UICtrl.DOMStrings.assetAdd)
        let elementAssetRemove = document.querySelector(UICtrl.DOMStrings.assetRemove)

        let elementAllocate = document.querySelector(UICtrl.DOMStrings.allocateButton)

        // add listeners
        // roundPct and sumPct for initial .pct__item
        elementPctVal.forEach(e => e.addEventListener('change', UICtrl.roundPct))
        elementPctVal.forEach(e => e.addEventListener('change', UICtrl.sumPct))
        // add sumCurVal
        elementCurrentVal.forEach(e => e.addEventListener('change', UICtrl.sumCurVal))
        // add/remove asset
        elementAssetAdd.addEventListener('click', UICtrl.addAsset)
        elementAssetRemove.addEventListener('click', UICtrl.removeAsset)
        // allocate assets when click button
        elementAllocate.addEventListener('click', allocateAssets)
    }

    return {
        init: function () {
            setupEventListeners()
        }
    }
})(UIController, allocationCalculator)

// console.log('hi')
controller.init()
