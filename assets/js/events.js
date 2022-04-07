const newEvent = document.querySelector('.add-event')
const modal = document.querySelector('.modal-container')
const form = document.querySelector('.modal-form')
let eventList = JSON.parse(localStorage.getItem('events')) || []

const loadEventsFromLocalStorage = () => {
  const events = JSON.parse(localStorage.getItem('events'))
  const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase()

  if(!events) return

  events
    .filter(event => {
      const { date } = event
      const newDate = new Date(date + ' ' + '00:00:00')
      const eventDate = `${newDate.toLocaleDateString('pt-BR', {month: 'long'})}, ${newDate.toLocaleDateString('pt-BR', {day: 'numeric'})}`
      return eventDate === selectedDay
    })
    .forEach(event => createNewEvent(event))
}

const handleFormData = (e) => {
  e.preventDefault()
  modal.style.display = 'none'
  
  const inputsElement = [...document.querySelectorAll('.modal-form input')]
  const eventData = inputsElement.reduce((acc, input) => {
    acc[input.classList.value] = input.value 
    return acc
  }, {})
  eventList.push(eventData)

  inputsElement.forEach(input => input.value = '')
 
  updateEventsFromLocalStorage()
  createNewEvent(eventData)
}

const updateEventsFromLocalStorage = () => {
  localStorage.setItem('events', JSON.stringify(eventList))
}

const createNewEvent = event => {
  const {title, description, startHour, endHour} = event

  const events = document.querySelector('.events')

  const eventCard = document.createElement('div')
  eventCard.classList.add('event-card')

  const eventWrapper = document.createElement('div')
  eventWrapper.classList.add('event')

  const eventOptions = document.createElement('span')
  eventOptions.classList.add('material-icons-sharp')
  eventOptions.innerText = 'more_horiz'

  eventCard.appendChild(eventWrapper)
  eventCard.appendChild(eventOptions)

  const eventHour = document.createElement('h2')
  eventHour.classList.add('event-hour')
  eventHour.innerText = `${startHour} - ${endHour}`

  const eventTitle = document.createElement('h4')
  eventTitle.classList.add('event-type')
  eventTitle.innerText = title

  const eventDescription = document.createElement('p')
  eventDescription.classList.add('event-description')
  eventDescription.innerText = description

  eventWrapper.appendChild(eventHour)
  eventWrapper.appendChild(eventTitle)
  eventWrapper.appendChild(eventDescription)

  events.appendChild(eventCard)

  eventCard.addEventListener('click', () => handleClickEventCard(eventCard))
  eventOptions.addEventListener('click', () => {
    modal.style.display = 'flex'
  })


  // <div class="event-card">
  //   <div class="event">
  //     <h2 class="event-hour">15:00 - 16:00</h2>
  //     <h4 class="event-type">Estudar CSS</h4>
  //     <p class="event-description">Origamid</p>
  //   </div>
  //   <span class="material-icons-sharp">more_horiz</span>
  // </div>
}

const handleClickEventCard = eventCard => {
  const eventCards = document.querySelectorAll('.event-card')

  eventCards.forEach(el => {
    const eventCardIsBeingClicked = el === eventCard
    const eventCardIsSelected = el.classList.contains('selected')
    const eventHour = (el.firstChild).firstChild

    if (eventCardIsSelected) {
      el.classList.remove('selected')
      eventHour.classList.remove('selected')
      return
    } 

    if (eventCardIsBeingClicked) {
      el.classList.add('selected')
      eventHour.classList.add('selected')
    } 
  })
}

loadEventsFromLocalStorage()

newEvent.addEventListener('click', () => { 
  modal.style.display = 'flex'

  const dateInput = document.querySelector('.modal-form .date')
  const selectedDay = document.querySelector('.selected-day').innerText.split(', ')
  const month = selectedDay[0]
  const day = selectedDay[1]
  const date = new Date(2022, 3, day)

  dateInput.value = date.toLocaleDateString('pt-BR').split('/').reverse().join('-')
})

modal.addEventListener('click', (e) => {
  if(e.target.classList.contains('close-modal')) modal.style.display = 'none'
})

form.addEventListener('submit', handleFormData)

document.addEventListener('click', (e) => {
  const day = e.target
  const calendar = document.querySelector('.month-days')
  
  if(calendar.contains(day)) {
    const events = document.querySelector('.events')
    events.innerText = ''
    loadEventsFromLocalStorage()
  }
})

// calendarDays.forEach(day => day.addEventListener('click', () => {
//   const events = document.querySelector('.events')
//   events.innerText = ''
//   loadEventsFromLocalStorage()
// }))
