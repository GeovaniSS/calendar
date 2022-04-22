const newEvent = document.querySelector('.add-event')
const modal = document.querySelector('.modal-container')
const form = document.querySelector('.modal-form')
const events = document.querySelector('.events')
let eventList = JSON.parse(localStorage.getItem('events')) || []

const loadEventsFromLocalStorage = () => {
  const events = JSON.parse(localStorage.getItem('events'))

  if(!events) return

  events
    // Ordenar os eventos pelo horário de início
    .sort((objA, objB) => {
      if (objA.startHour > objB.startHour) return 1;
      if (objA.startHour < objB.startHour) return -1;
      return 0;
    })
    // Carregar os eventos do dia selecionado
    .filter(event => {
      const { date } = event
      return eventDateIsEqualSelectedDay(date)
    })
    // Criar os eventos do dia selecionado no HTML
    .forEach(event => createNewEvent(event))
    
    // Carregar o evento do horário atual
    loadCurrentEvent()
}

const loadCurrentEvent = () => {
  const eventCards = events.children

  for (let eventCard of eventCards) {
    const eventHour = eventCard.querySelector('.event-hour').innerText.split(' - ')

    const startHour = eventHour[0].split(':').join('')
    const endHour = eventHour[1].split(':').join('')

    const day = new Date().getDate()
    const hour = new Date().getHours()
    const minutes = new Date().getMinutes()
    const hours = String(hour) + String(minutes)

    const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase().split(', ')

    if(selectedDay[1] != day) return
    if (hours >= startHour && hours <= endHour) {
      eventCard.classList.add('selected')
    }
  }
}

const eventDateIsEqualSelectedDay = eventDate => {
  const date = new Date(`${eventDate} 00:00:00`)
  const eventDateString = `${date.toLocaleDateString('pt-BR', {month: 'long'})}, ${date.getDate()}`
  const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase()

  return eventDateString === selectedDay
}

const handleModalFormData = (e) => {
  e.preventDefault()
  modal.style.display = 'none'

  // Coletando os dados do formulário e criando um objeto
  const formElements = [...document.querySelectorAll('.form-elements')]
  const eventData = formElements.reduce((obj, el) => {
    obj[el.id] = el.value.trim()
    return obj
  }, {})
  eventList.push(eventData)
  
  // Criando o evento que seja igual ao dia selecionado
  const { date } = eventData
  if (eventDateIsEqualSelectedDay(date)) 
    createNewEvent(eventData)
  
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

  const eventDetails = document.createElement('div')
  eventDetails.classList.add('event-details')

  const eventEdit = document.createElement('span')
  eventEdit.classList.add('material-icons-sharp')
  eventEdit.innerText = 'more_horiz'

  eventCard.appendChild(eventDetails)
  eventCard.appendChild(eventEdit)

  const eventHour = document.createElement('h2')
  eventHour.classList.add('event-hour')
  eventHour.innerText = `${startHour} - ${endHour}`

  const eventTitle = document.createElement('h4')
  eventTitle.classList.add('event-title')
  eventTitle.innerText = title

  const eventDescription = document.createElement('p')
  eventDescription.classList.add('event-description')
  eventDescription.innerText = description

  eventDetails.appendChild(eventHour)
  eventDetails.appendChild(eventTitle)
  eventDetails.appendChild(eventDescription)

  events.appendChild(eventCard)

  eventCard.addEventListener('click', () => handleClickEventCard(eventCard))
  eventEdit.addEventListener('click', () => handleEventEdit(eventEdit)) 
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

const handleEventEdit = eventEdit => {
  modal.style.display = 'flex'

  const eventCards = events.children

  for (let eventCard of eventCards) {
    const eventCardIsBeingEdited = eventCard.lastChild === eventEdit

    if (eventCardIsBeingEdited) { 
      const eventHour = eventCard.querySelector('.event-hour').innerText.split(' - ')

      const event = {
        title: eventCard.querySelector('.event-title').innerText,
        description: eventCard.querySelector('.event-description').innerText,
        date: loadModalDateInput(),
        startHour: eventHour[0],
        endHour: eventHour[1]
      }

      const formElements = [...document.querySelectorAll('.form-elements')]
      formElements.forEach(el => {
        for (let key in event) {
          if(key === el.id) {
            el.value = event[key]
          }
        }
      })

      eventList.forEach((eventData, i) => {
        const eventDataIsEqualsEditEvent = JSON.stringify(eventData) === JSON.stringify(event)
        
        if(eventDataIsEqualsEditEvent) {
          eventList.splice(i, 1)
          events.removeChild(eventCard)
          updateEventsFromLocalStorage()
        }
      })
    }
  }
}

const loadModalDateInput = () => {
  const date = document.querySelector('.date').innerText.split(' ')
  const dateInput = document.getElementById('date')

  const year = date[1]
  const month = monthFromString(date[0])
  const day = document.querySelector('.selected-day').innerText.split(', ')[1]
  
  return dateInput.value = new Date(`${year}-${month}-${day} 00:00:00`)
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

const clearFormElements = () => {
  const formElements = [...document.querySelectorAll('.form-elements')]
  formElements.forEach(el => el.value = '')
}

const openModal = () => {
  modal.style.display = 'flex'
  clearFormElements()
  loadModalDateInput()
}

const closeModal = (e) => {
  const el = e.target

  if(el.classList.contains('close-modal')) {
    modal.style.display = 'none'
  }
}

loadEventsFromLocalStorage()

newEvent.addEventListener('click', () => openModal())
modal.addEventListener('click', (e) => closeModal(e))
form.addEventListener('submit', (e) => handleModalFormData(e))