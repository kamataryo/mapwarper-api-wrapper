const fetch = require('node-fetch')
const fs = require('fs')
const {ENDPOINT} = process.env

const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec))

const main = async () => {
    let isEnd = false
    let page = 1
    const items = []
    while (!isEnd) {
        const url = `${ENDPOINT}/api/v1/maps.json?page=${page}`
        const { data, meta: { total_pages } } = await fetch(url).then(res => res.json())
        console.log(`Fetched: ${page}/${total_pages}`)
        isEnd = page === total_pages
        page++
        items.push(...data)
        await sleep(1000)
    }
    const csv = items.reduce((prev, item) => {
        return prev + '\n' + [
            `"${item.id}"`,
            `"${item.attributes.title}"`,
            `"${item.links.self}"`,
            `"${item.attributes.status}"`,
            `"${item.attributes.mask_status}"`
        ].join(',')
    }, [
        '"id"',
        '"title"',
        '"url"',
        '"status"',
        '"mask_status"'
    ].join(','))
    fs.writeFileSync('./data.csv', csv)    
}

main()