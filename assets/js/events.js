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

const eventDateIsEqualSelectedDay = eventDate => {
  const date = new Date(`${eventDate} 00:00:00`)
  const dateString = `${date.toLocaleDateString('pt-BR', {month: 'long'})}, ${date.getDate()}`
  const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase()

  return dateString === selectedDay
}

const loadCurrentEvent = () => {
  const eventCards = events.children

  for (let eventCard of eventCards) {
    const eventWrapper = eventCard.firstChild
    const eventHour = eventWrapper.firstChild.innerText.split(' - ')

    const startHour = eventHour[0].split(':')
    const endHour = eventHour[1].split(':')

    const date = new Date()
    const hour = date.getHours()
    const day = date.getDate()

    const selectedDay = document.querySelector('.selected-day').innerText.toLowerCase().split(', ')

    if(selectedDay[1] != day) return

    if (hour >= startHour[0] && hour <= endHour[0]) {
      eventCard.classList.add('selected')
    }
  }
}

const clearFormElements = () => {
  const formElements = [...document.querySelectorAll('.modal-form input'), document.querySelector('.modal-form textarea')]
  formElements.forEach(el => el.value = '')
}

const handleModalFormData = (e) => {
  e.preventDefault()
  modal.style.display = 'none'

  // Coletando os dados do formulário e criando um objeto
  const formElements = [...document.querySelectorAll('.modal-form input'), document.querySelector('.modal-form textarea')]
  const eventData = formElements.reduce((acc, el) => {
    acc[el.classList.value] = el.value.trim()
    return acc
  }, {})
  eventList.push(eventData)
  
  // Criando o evento que seja igual ao dia selecionado
  const { date } = eventData
  if (eventDateIsEqualSelectedDay(date)) {
    createNewEvent(eventData)
  }
  
  clearFormElements()
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
        date: loadModalDateInput(),
        startHour: eventHour.innerText.split(' - ')[0],
        endHour: eventHour.innerText.split(' - ')[1],
        description: eventWrapper.lastChild.innerText
      }

      const formElements = [...document.querySelectorAll('.modal-form input'), document.querySelector('.modal-form textarea')]
      formElements.forEach(el => {
        for (let key in event) {
          if(key === el.classList.value) {
            el.value = event[key]
          }
        }
      })

      eventList.forEach((eventData, i) => {
        const isEquals = JSON.stringify(eventData) === JSON.stringify(event)

        console.log(JSON.stringify(eventData))
        console.log(JSON.stringify(event))
        
        if(isEquals) {
          eventList.splice(i, 1)
          events.removeChild(eventCard)
          updateEventsFromLocalStorage()
        }
      })
    }
  }
}

const closeModal = (e) => {
  const el = e.target

  if(el.classList.contains('close-modal')) {
    modal.style.display = 'none'
  }
}

const loadModalDateInput = () => {
  modal.style.display = 'flex'

  const dateInput = document.querySelector('.modal-form .date')
  const selectedDay = document.querySelector('.selected-day').innerText.split(', ')

  const month = monthFromString(selectedDay[0])
  const day = selectedDay[1]

  clearFormElements()
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
modal.addEventListener('click', (e) => closeModal(e))
form.addEventListener('submit', (e) => handleModalFormData(e))