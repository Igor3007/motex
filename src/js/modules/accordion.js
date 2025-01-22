var res = []

document.querySelectorAll('.catlist-elems-item').forEach(item => {
    let obj = {
        icon: item.querySelector('.catlist-elems-item__img img').src,
        name: item.querySelector('.catlist-elems-item__img').title,
        sub: []
    }

    res.push(obj)
})

console.log(res)

document.querySelectorAll('.b-lm-item.active .b-lm-item-sublist .b-lm-subitem ').forEach(item => {
    item.querySelectorAll('.lm-supersub .lm-supersub-col').forEach(sub => {

        let sobj = {
            name: sub.querySelector('.lm-supersub__title').innerText.trim(),
            count: sub.querySelector('.b-lm-item__count').innerText.trim()
        }

        res.forEach(r => {
            if (r.name.trim() == item.querySelector('.b-lm-item__href').innerText.trim()) {
                r.sub.push(sobj)
            }
        })

    })
})

console.log(JSON.stringify(res))