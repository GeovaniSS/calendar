const newEvent = document.querySelector('.add-event')
const modal = document.querySelector('.modal-container')
const form = document.querySelector('.modal-form')
const events = document.querySelector('.events')
let eventList = JSON.parse(localStorage.getItem('events')) || []

const loadEventsFromLocalStorage = () => {
  const events = JSON.parse(localStorage.getItem('events'))

  if(!events) return

  // Ordenar os eventos pelo horário de início
  events.sort((objA, objB) => {
    if (objA.startHour > objB.startHour) return 1;
    if (objA.startHour < objB.startHour) return -1;
    return 0;
  })

  // Carregar os eventos do dia selecionado
  events
    .filter(event => {
      const { date } = event
      return eventDateIsEqualSelectedDay(date)
    })
    .forEach(event => createNewEvent(event))
}

const eventDateIsEqualSelectedDay = eventDate => {
  const date = new Date(`${eventDate} 00:00:00`)
  const dateString = `${date.toLocaleDateString('pt-BR', {month: 'long'})}, ${date.getDate()}`
  const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase()

  return dateString === selectedDay
}

const clearInputsElement = () => {
  const inputsElement = [...document.querySelectorAll('.modal-form input')]
  inputsElement.forEach(input => input.value = '')
}

const handleModalFormData = (e) => {
  // e.preventDefault()
  modal.style.display = 'none'
  
  const inputsElement = [...document.querySelectorAll('.modal-form input')]
  const eventData = inputsElement.reduce((acc, input) => {
    acc[input.classList.value] = input.value.trim()
    return acc
  }, {})
  eventList.push(eventData)
  
  const dataInput = document.querySelector('.modal-form .date')
  
  if (eventDateIsEqualSelectedDay(dataInput.value)) 
    createNewEvent(eventData)
  
  clearInputsElement()
  updateEventsFromLocalStorage()
}

const updateEventsFromLocalStorage = () => {
  // Salvar os eventos no armazenamento local do navegador
  localStorage.setItem('events', JSON.stringify(eventList))
}

const createNewEvent = eventData => {
  const {title, description, startHour, endHour} = eventData

  const eventCard = document.createElement('div')
  eventCard.classList.add('event-card')

  const eventWrapper = document.createElement('div')
  eventWrapper.classList.add('event')

  const eventDetails = document.createElement('span')
  eventDetails.classList.add('material-icons-sharp')
  eventDetails.innerText = 'more_horiz'

  eventCard.appendChild(eventWrapper)
  eventCard.appendChild(eventDetails)

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
  eventDetails.addEventListener('click', () => handleEventEdit(eventDetails))  
  // <div class="event-card">
  //   <div class="event">
  //     <h2 class="event-hour">15:00 - 16:00</h2>
  //     <h4 class="event-type">Estudar CSS</h4>
  //     <p class="event-description">Origamid</p>
  //   </div>
  //   <span class="material-icons-sharp">more_horiz</span>
  // </div>
}

const handleClickEventCard = event => {
  const eventCards = events.children

  for (let eventCard of eventCards) {
    const eventCardIsBeingClicked = eventCard === event
    const eventCardIsSelected = eventCard.classList.contains('selected')

    if (eventCardIsBeingClicked) 
      eventCard.classList.add('selected')

    if(eventCardIsSelected)
      eventCard.classList.remove('selected')
  }
}

const handleEventEdit = eventDetails => {
  modal.style.display = 'flex'

  const eventCards = events.children

  for (let eventCard of eventCards) {
    const eventCardIsBeingEdited = eventCard.lastChild === eventDetails

    if (eventCardIsBeingEdited) { 
      const eventWrapper = eventCard.firstChild
      const eventHour = eventWrapper.firstChild

      const event = {
        title: eventHour.nextSibling.innerText,
        description: eventWrapper.lastChild.innerText,
        date: loadModalDateInput(),
        startHour: eventHour.innerText.split(' - ')[0],
        endHour: eventHour.innerText.split(' - ')[1]
      }

      const inputsElement = [...document.querySelectorAll('.modal-form input')]
      inputsElement.forEach(input => {
        for (let key in event) {
          if(key === input.classList.value) {
            input.value = event[key]
          }
        }
      })

      eventList.forEach((eventData, i) => {
        const isEquals = JSON.stringify(eventData) === JSON.stringify(event)
        
        if(isEquals) {
          eventList.splice(i, 1)
          events.removeChild(eventCard)
          updateEventsFromLocalStorage()
        }
      })
      // modal.onclick = (e) => handleDeleteEventCard(e, eventCard)
      // form.onsubmit = () => {
      //   if (eventCardIsBeingEdited) {
      //     events.removeChild(eventCard)
      //   }
      // }
    }
  }
}

const handleDeleteEventCard = (e, eventCard) => {
  const el = e.target

  if(el.classList.contains('close-modal')) {
    modal.style.display = 'none'
    
    if(!eventCard) return
    events.removeChild(eventCard)
  }
}

const loadModalDateInput = () => {
  modal.style.display = 'flex'

  const dateInput = document.querySelector('.modal-form .date')
  const selectedDay = document.querySelector('.selected-day').innerText.split(', ')

  const month = monthFromString(selectedDay[0])
  const day = selectedDay[1]

  clearInputsElement()
  return dateInput.value = new Date(`2022-${month}-${day} 00:00:00`)
  .toLocaleDateString('pt-BR').split('/').reverse().join('-')
}

const monthFromString = monthString => {
  const months = {
    janeiro: '01',
    fevereiro: '02',
    março: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12'
  }

  for (let month in months) {
    if(month === monthString.toLowerCase()) 
      return months[month]
  }
}

loadEventsFromLocalStorage()

newEvent.addEventListener('click', () => loadModalDateInput())
modal.addEventListener('click', (e) => handleDeleteEventCard(e))
form.addEventListener('submit', (e) => handleModalFormData(e))