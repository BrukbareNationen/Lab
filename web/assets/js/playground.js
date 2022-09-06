/* Appear */
const appearObs = new IntersectionObserver(e => {
    e.forEach(entry => {
        let t = entry.target
        if (entry.isIntersecting) t.classList.add('appeared')
    })
})
const appearElements = document.querySelectorAll('.appear')
appearElements.forEach((e) => { appearObs.observe(e) })


/* Route */ 
const route = [
    {
        'name': 'Trykk',
        'offset': 980,
        'distance': 0,
        'timestamp': '2022-08-15T14:15Z',
        'ferries': 0      
    },
    {
        'name': 'Avgang',
        'offset': 980,
        'distance': 0,
        'timestamp': '2022-08-15T19:08Z',
        'ferries': 0
    },
    {
        'name': 'Halsa ferjekai',
        'offset': 662,
        'distance': 103,        
        'timestamp': '2022-08-15T20:40Z',
        'ferries': 0
    },
    {
        'name': 'Molde ferjekai',
        'offset': 435,
        'distance': 177,
        'timestamp': '2022-08-15T22:45Z',
        'ferries': 1
    },
    {
        'name': 'Solavågen ferjekai',
        'offset': 189,
        'distance': 200,
        'timestamp': '2022-08-16T00:40Z',
        'ferries': 2
    },
    {
        'name': 'Ørsta sentrum',
        'offset': 66,
        'distance': 296,
        'timestamp': '2022-08-16T02:02Z',
        'ferries': 3
    },
    {
        'name': 'Abonnent',
        'offset': 0,
        'distance': 316,
        'timestamp': '2022-08-16T02:33Z',
        'ferries': 3
    }
]

// Config
let travelStatus = 0, // Array index
    routeTime = 7000,
    __container = document.querySelector('.route-map-container'),
    __path = document.querySelector('.route-map-route'),
    __hours = document.querySelector('.route-hours'),
    __minutes = document.querySelector('.route-minutes'),
    __ferries = document.querySelector('.route-ferries'),
    __distance = document.querySelector('.route-distance')

// General functions
function mToHm(min) {
    console.log(min)
    return {'hrs': Math.floor(min / 60), 'min': min % 60}
}
function getLineProgressCoordinates(path, from, to, progress) {
    px = Math.round(from + ((to - from) * progress))
    pt = path.getPointAtLength(px)
    return {'x': Math.round(pt.x), 'y': Math.round(pt.y)}
}

// Animate
function travelAnimate(from, to) {
    let s = null
    let px = to.offset - from.offset
    let duration = Math.max((Math.abs(px) / route[0].offset) * routeTime, 1500) // Duration in ms, minimum 1500
    let minutes = ((new Date(to.timestamp)) - (new Date(from.timestamp))) / 60000
    let minutesFrom = ((new Date(from.timestamp)) - (new Date(route[0].timestamp))) / 60000
    let distance = to.distance - from.distance
    let ferries = to.ferries - from.ferries
    function step(t) {
        if (!s) s = t // First frame timestamp
        let ms = t - s // Ms passed
        let progress = (ms / duration).toPrecision(2) // Ratio of duration
        progress = -(Math.cos(Math.PI * progress) - 1) / 2
        let stopwatch = mToHm(Math.round(minutesFrom + (minutes * progress)))
        __hours.innerHTML = stopwatch.hrs
        __minutes.innerHTML = stopwatch.min
        __ferries.innerHTML = Math.round(from.ferries + (ferries * progress))
        __distance.innerHTML = Math.round(from.distance + (distance * progress))
        __path.style.strokeDashoffset = Math.round(from.offset + (px * progress)) + 'px'
        if (ms < duration) window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
}

// Set route for animation and update travel status
function travelTo(d) {
    let i = route.findIndex((a) => a.name == d)
    if (i != travelStatus) {
        travelAnimate(route[travelStatus], route[i])
        travelStatus = i
    }
}

// Observe section triggers
var sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        let t = entry.target
        let s = t.parentNode
        if (entry.isIntersecting && s.dataset.section) {
            let sectionName = s.dataset.section
            s.classList.add('active')
            s.querySelector('.route-map-target').append(__container)
            travelTo(sectionName)
        }
        else s.classList.remove('active')
    })
}, { threshold: 0.1 })
const sections = document.querySelectorAll('.route-trigger')
sections.forEach(s => sectionObserver.observe(s))