const announcementElement = document.getElementById('announcement')
const esIstDoElement = document.getElementById('esistdo')
const heroElement = document.getElementById('hero')

function updateText(title) {
  announcementElement.innerHTML = title
}

function countdown(daysLeft) {
  if (daysLeft === 0) return 'HEUTE'
  if (daysLeft === 1) return 'morgen'
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

const makeBlocks = (...lines) => lines
  .map(line => `<span class="block">${line}</span>`)
  .join('\n')

const donnerstag = 4
const millisecondsPerDay = 86400000
const link = document.querySelector("link[rel='shortcut icon']")
  || document.createElement('link');
const originalUrl = link.href

function update() {
  const today = new Date().getDay()
  const daysTilDonnerstag = (donnerstag + 7 - today) % 7
  updateIcon(link, daysTilDonnerstag, originalUrl)

  if (today === donnerstag) {
    // ES IST WIEDER DONNERSTAG
    document.title = 'Es ist wieder Donnerstag!'
    show(esIstDoElement)
    hide(announcementElement)
  } else {
    // BALD IST WIEDER DONNERSTAG
    show(announcementElement)
    hide(esIstDoElement)
    const nextDonnerstag =
      new Date(Date.now() + daysTilDonnerstag * millisecondsPerDay)
    const dateString =
      nextDonnerstag.toLocaleDateString('de-AT', {month: 'long', day: 'numeric' })
    const plural = daysTilDonnerstag > 1
  
    document.title = countdown(daysTilDonnerstag)
  
    updateText(
      makeBlocks(
        `Am ${dateString}`,
        `ist wieder`,
        `Donners&#8203;tag!`
      )
    )
  
    rescale()
    window.addEventListener('load', rescale)
    window.addEventListener('resize', rescale)
    window.addEventListener('orientationchange', rescale)
  }  
}

update()
setInterval(update, 1000)
