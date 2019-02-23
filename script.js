const announcementElement = document.getElementById('announcement')
const esIstDoElement = document.getElementById('esistdo')

function update(subtitle, title) {
  // smallDiv.innerHTML = subtitle
  announcementElement.innerHTML = title
  announcementElement.style.visibility = 'visible'
}

function countdown(daysLeft) {
  if (daysLeft === 0) return 'HEUTE'
  if (daysLeft === 1) return 'morgen'
  return `in ${daysLeft} Tagen`
}

function show(element) {
  element.classList.remove('hidden')
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
      countdown(daysTilDonnerstag),
      `Am ${dateString}`,
      `ist wieder`,
      `Donners&#8203;tag!`
    )
  )
}
