export default 
    document.querySelectorAll('[data-scroll]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = e.target?.attributes?.href?.value;

        if (href && document.querySelector(href)) {
        window.scrollToTargetAdjusted({
            elem: document.querySelector(href),
            offset: window.globalConfig.hgtheader + 36
        })
        } else if (document.querySelector(e.target.dataset.scroll)) {
        window.scrollToTargetAdjusted({
            elem: document.querySelector(e.target.dataset.scroll),
            offset: window.globalConfig.hgtheader + 36
        })
        }
    })
})