const announcementElement = document.getElementById('announcement')
const esIstDoElement = document.getElementById('esistdo')
const heroElement = document.getElementById('hero')

function update(subtitle, title) {
  // smallDiv.innerHTML = subtitle
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

const makeBlocks = (...lines) => lines
  .map(line => `<span class="block">${line}</span>`)
  .join('\n')

const today = new Date().getDay()
const donnerstag = 4
const millisecondsPerDay = 86400000

if (today === donnerstag) {
  // ES IST WIEDER DONNERSTAG
  document.title = 'Es ist wieder Donnerstag!'
  show(esIstDoElement)
} else {
  // BALD IST WIEDER DONNERSTAG
  show(announcementElement)
  const daysTilDonnerstag = (donnerstag + 7 - today) % 7
  const nextDonnerstag =
    new Date(Date.now() + daysTilDonnerstag * millisecondsPerDay)
  const dateString =
    nextDonnerstag.toLocaleDateString('de-AT', {month: 'long', day: 'numeric' })
  const plural = daysTilDonnerstag > 1

  document.title = countdown(daysTilDonnerstag)

  update(
    `${daysTilDonnerstag} Tag${plural ? 'e' : ''} noch!`,
    makeBlocks(
      `Am ${dateString}`,
      `ist wieder`,
      `Donners&#8203;tag!`
    )
  )

  window.addEventListener('load', rescale)
  window.addEventListener('resize', rescale)
  window.addEventListener('orientationchange', rescale)
  
}
