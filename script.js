const announcementElement = document.getElementById('announcement')
const esIstDoElement = document.getElementById('esistdo')
const heroElement = document.getElementById('hero')
const wrapperElements = document.getElementsByClassName('wrapper')

function updateText(title) {
  announcementElement.innerHTML = title
}

function countdown(daysLeft, title) {
  if (daysLeft === 0) return 'HEUTE'
  if (daysLeft === 1) return 'morgen'
  if (daysLeft === 2) return title ? 'übermorgen' : 'über&#8203;morgen'
  return `in ${daysLeft} Tagen`
}

function show(element) {
  element.classList.remove('hidden')
}

function hide(element) {
  element.classList.add('hidden')
}

function rescale() {
  const availableWidth = heroElement.clientWidth -
    heroElement.style.paddingLeft - heroElement.style.paddingRight
  const availableHeight = heroElement.clientHeight -
    heroElement.style.paddingTop - heroElement.style.paddingBottom
  const scale = Math.min( 
    availableWidth / announcementElement.offsetWidth, 
    availableHeight / announcementElement.offsetHeight 
  )

  announcementElement.style.transform = `scale(${scale})`
}

function updateIcon(link, days, originalUrl) {
  if (days < 7 && days > 0) {
    link.href = `countdown/${days}.png`;
  } else {
    link.href = originalUrl
  }
}

const replaceClassNames = (classOld, classNew) => element => {
  element.classList.remove(classOld)
  element.classList.add(classNew)
}

const makeBlock = (line, classes = '') =>
  `<span class="block ${classes}">${line}</span>`

const donnerstag = 4
const millisecondsPerDay = 86400000
const link = document.querySelector("link[rel='shortcut icon']")
  || document.createElement('link');
const originalUrl = link.href

function update(date) {
  const today = date.getDay()
  const daysTilDonnerstag = (donnerstag + 7 - today) % 7
  updateIcon(link, daysTilDonnerstag, originalUrl)

  if (today === donnerstag) {
    // ES IST WIEDER DONNERSTAG
    document.title = 'Es ist wieder Donnerstag!'
    show(esIstDoElement)
    hide(announcementElement)

    const jetztZam = 
      Array.from(document.querySelectorAll('svg.jetztzam'))
    const wiederDo =
      Array.from(document.querySelectorAll('svg.wiederdo'))

    const [ hoverOnly, noHoverOnly ] = date.getHours() >= 18
      ? [ wiederDo, jetztZam ] : [ jetztZam, wiederDo ]

     // WIR SIND JETZT ZUSAMMEN
    hoverOnly.forEach(replaceClassNames('nohoveronly', 'hoveronly'))
    noHoverOnly.forEach(replaceClassNames('hoveronly', 'nohoveronly'))
  } else {
    // BALD IST WIEDER DONNERSTAG
    show(announcementElement)
    hide(esIstDoElement)
    const nextDonnerstag =
      new Date(Date.now() + daysTilDonnerstag * millisecondsPerDay)
    const dateString = nextDonnerstag
      .toLocaleDateString('de-AT', { month: 'long', day: 'numeric' })
    const plural = daysTilDonnerstag > 1
  
    document.title = countdown(daysTilDonnerstag, true)
  
    updateText(
      [
        makeBlock(countdown(daysTilDonnerstag), 'nohoveronly'),
        makeBlock(`Am ${dateString}`, 'hoveronly'),
        makeBlock(`ist wieder`),
        makeBlock(`Donners&#8203;tag!`)
      ].join('\n')
    )
  
    rescale()
    window.addEventListener('load', rescale)
    window.addEventListener('resize', rescale)
    window.addEventListener('orientationchange', rescale)
  }  
}

document.body.addEventListener('dblclick', document.body.requestFullscreen)

heroElement.addEventListener('touchstart', event => event.stopPropagation(), true)

Array.from(wrapperElements).forEach(wrapper => {
  let touchStartTime
  const makeTouchSwitch = value =>  event => {
    console.log(event)
    event.stopImmediatePropagation()
    if (value) {
      wrapper.classList.add('touched')
      touchStartTime = event.timeStamp
    } else {
      const timeTouched = event.timeStamp - touchStartTime
      setTimeout(() => wrapper.classList.remove('touched'))
      // timeTouched < 10 ? 10 - timeTouched :0)
    }
  }

  document.body.addEventListener('touchstart', makeTouchSwitch(true), true)
  document.body.addEventListener('touchend', makeTouchSwitch(false), true)
  document.body.addEventListener('touchcancel', makeTouchSwitch(false), true)

})

function run() {
  update(new Date())
}

hero.classList.remove('hidden')

run()
let interval = setInterval(run, 1000)
