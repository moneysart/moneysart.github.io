let UIController = (function () {
    let DOMStrings = {
        capital: '#capital',
        assetNum: '#asset__num',
        assetAdd: '#asset__add',
        assetRemove: '#asset__remove',
        assetList: '.asset__list',
        percentList: '.pct__list',
        amountList: '.amt__list',
        assetItem: '.asset__item',
        percentItem: '.pct__item',
        amountItem: '.amt__item',
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

    return {
        DOMStrings,

        getNumAsset,

        roundPct,

        addAsset: function () {

            // prepare id of the next item
            let id = getNumAsset() + 1

            // do not overdo it
            if (id <= 20) {
                // elements to insert form fields for asset's info 
                let parentElement = [DOMStrings.assetList, DOMStrings.percentList, DOMStrings.amountList]

                // html text to insert
                let html = [`
                <input id="asset-%id%" 
                class="form-control text-center my-1 asset__item" 
                type="text" value="สินทรัพย์นี้ดี-%id%" 
                placeholder="Place Your Asset Name"
                >
                `,
                    `
                <input id="pct-%id%" 
                class="form-control text-center my-1 pct__item" 
                type="number" 
                min=0 max= 100 value="0" 
                placeholder="สัดส่วน เป็น %"" 
                >
                `,
                    `
                <input id="amt-%id%" 
                class="form-control text-center my-1 amt__item" 
                type="text" placeholder="???"
                readonly
                >
                `,
                ]

                // insert HTML in DOM
                for (let i = 0; i < parentElement.length; i++) {
                    // replace placeholder text with actual data 
                    let newHtml = html[i].replace('%id%', id).replace('%id%', id)

                    // insert as a child, and at the end of the selected element
                    document.querySelector(parentElement[i]).insertAdjacentHTML('beforeend', newHtml)
                }

                // add addEventListener (roundPct) to new #pct-id
                document.querySelector('#pct-' + id).addEventListener('change', roundPct)

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
                    document.getElementById("pct-" + id),
                    document.getElementById("amt-" + id)
                ]

                // JS does not allow remove an element directly
                // But we can ascend to the parent element and remove its child
                // console.log(elements)
                elements.forEach(e => e.parentNode.removeChild(e))

                // update number of assets
                document.querySelector(DOMStrings.assetNum).value = id - 1
            }
        }
    }
})()


let allocationCalculator = (function () {

    // function to sum target allocation
    let sumAllocation = function (DOMpercentItem) {
        let items = document.querySelectorAll(DOMpercentItem)
        let itemsVal = Array.from(items).map(i => parseInt(i.value))
        let sumAlct = itemsVal.reduce((acc, cur) => acc + cur)

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
        allocateAsset: function (DOMpercentItem, DOMSamountItem, lastID) {
            // get sum of target allocation
            let sumAlct = sumAllocation(DOMpercentItem)

            // alert if total pct allocation !== 100, then exist calculation
            if (sumAlct !== 100) {
                alertAllocation(sumAlct, lastID)
                let elementAmt = document.querySelectorAll(DOMSamountItem)
                elementAmt.forEach((e) => {
                    e.value = "???"
                })
                return;
            }

            // calculate amount to allocate
            let capital = Number(document.querySelector('#capital').value)
            let items = document.querySelectorAll(DOMSamountItem)
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
        allocationCal.allocateAsset(UICtrl.DOMStrings.percentItem, UICtrl.DOMStrings.amountItem, UICtrl.getNumAsset())
    }

    // function to add event listeners to HTML elements
    let setupEventListeners = function () {
        // get elements
        let elementPctVal = document.querySelectorAll(UICtrl.DOMStrings.percentItem)

        let elementAssetAdd = document.querySelector(UICtrl.DOMStrings.assetAdd)
        let elementAssetRemove = document.querySelector(UICtrl.DOMStrings.assetRemove)

        let elementAllocate = document.querySelector(UICtrl.DOMStrings.allocateButton)

        // add listeners
        // roundPct for initial .pct__item
        elementPctVal.forEach(e => e.addEventListener('change', UICtrl.roundPct))
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
