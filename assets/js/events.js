const newEvent = document.querySelector('.add-event')
const modal = document.querySelector('.modal-container')
const modalForm = document.querySelector('.modal-form')

const colectForm = (e) => {
  e.preventDefault()
  modal.style.display = 'none'
  
  const inputsElement = [...document.querySelectorAll('.modal-form input')]

  const event = inputsElement.reduce((acc, input) => {
    acc[input.classList.value] = input.value 
    return acc
  }, {})
  createEvent(event)
}

const createEvent = event => {
  const events = document.querySelector('.events')

  const eventCard = document.createElement('div')
  eventCard.classList.add('event-card')

  eventCard.addEventListener('click', () => {
    eventCard.classList.remove('event-card')
    eventCard.classList.add('event-card--selected')
  })

  const eventWrapper = document.createElement('div')
  eventWrapper.classList.add('event')

  const eventOptions = document.createElement('span')
  eventOptions.classList.add('material-icons-sharp')
  eventOptions.innerText = 'more_horiz'

  eventOptions.addEventListener('click', () => {
    modal.style.display = 'flex'
  })

  eventCard.appendChild(eventWrapper)
  eventCard.appendChild(eventOptions)

  const eventHour = document.createElement('h2')
  eventHour.classList.add('event-hour')
  eventHour.innerText = `${event.start} - ${event.end}`

  const eventTitle = document.createElement('h4')
  eventTitle.classList.add('event-type')
  eventTitle.innerText = event.title

  const eventDescription = document.createElement('p')
  eventDescription.classList.add('event-description')
  eventDescription.innerText = event.description

  eventWrapper.appendChild(eventHour)
  eventWrapper.appendChild(eventTitle)
  eventWrapper.appendChild(eventDescription)

  events.appendChild(eventCard)

  // <div class="event-card">
  //   <div class="event">
  //     <h2 class="event-hour">15:00 - 16:00</h2>
  //     <h4 class="event-type">Estudar CSS</h4>
  //     <p class="event-description">Origamid</p>
  //   </div>
  //   <span class="material-icons-sharp">more_horiz</span>
  // </div>
}


newEvent.addEventListener('click', () => modal.style.display = 'flex')
modal.addEventListener('click', (e) => {
  if(e.target.classList.contains('close-modal')) modal.style.display = 'none'
})
modalForm.addEventListener('submit', colectForm)
