const date = new Date()

const year = date.getFullYear()
const currentMonth = date.getMonth()
const currentWeek = date.getDay()
const today = date.getDate()

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
let nav = currentMonth

const calendar = document.querySelector('.month-days') 

const loadDate = month => {
  const dateElement = document.querySelector('.date')
  dateElement.innerText = getDate(month)
  
  const weekDays = document.querySelectorAll('.week-days div')
  weekDays.forEach((weekDay, i) => {
    weekDay.classList.remove('current-week--day')
    
    if (i === currentWeek && month === currentMonth) 
      weekDay.classList.add('current-week--day')
  })
}

const loadSelectedDay = (month, day) => {
  const selectedDay = document.querySelector('.selected-day')
  selectedDay.innerText = getSelectedDate(month, day)
}

const loadCalendar = month => {
  calendar.innerText = ''
  const totalMonthDays = getTotalMonthDays(month)
  const totalPreviousMonthDays = getTotalMonthDays(month - 1)

  const firstDay = getfirstDay(month) - 1 
  const lastDay = getLastDay(month) + 1
  const today = date.getDate()

  // Load Previous Month Days
  for (let i = totalPreviousMonthDays - firstDay; i <= totalPreviousMonthDays; i++) {
    const previousMonthDayElement = createMonthDayElement(i)
    previousMonthDayElement.classList.add('prev-date')
    calendar.appendChild(previousMonthDayElement)
  }
  
  // Load Current Month Days
  for (let i = 1; i <= totalMonthDays; i++) {
    const monthDayElement = createMonthDayElement(i)

    if(i === today && month === currentMonth) 
      monthDayElement.classList.add('today')

    calendar.appendChild(monthDayElement)
  }

  // Load Next Month Days
  for (let i = 1; i <= 7 - lastDay; i++) {
    const nextMonthDayElement = createMonthDayElement(i)
    nextMonthDayElement.classList.add('next-date')
    calendar.appendChild(nextMonthDayElement)
  }

  handleSelectedDay(month)
}

const handleSelectedDay = month => {
  const days = document.querySelectorAll('.month-days div')

  days.forEach(day => day.addEventListener('click', () => {
    if (day.classList.contains('prev-date')) 
      return loadSelectedDay(month - 1, day.innerText)
    
    if (day.classList.contains('next-date')) 
      return loadSelectedDay(month + 1, day.innerText)
    
    loadSelectedDay(month, day.innerText)
    
    events.innerText = ''
    loadEventsFromLocalStorage()
  }))
}

const createMonthDayElement = day => {
  const monthDayElement = document.createElement('div')
  monthDayElement.innerText = day

  return monthDayElement
}

const getDate = month => {
  const date = new Date(year, month)
  return `${date.toLocaleDateString('pt-BR', {month: 'long'})} ${date.getFullYear()}`
}

const getSelectedDate = (month, day) => {
  const date = new Date(year, month, day)
  return `${date.toLocaleDateString('pt-BR', {month: 'long'})}, ${date.getDate()}`
}

const getTotalMonthDays = month => {
  const totalMonthDays = new Date(year, month + 1, 0)
  return totalMonthDays.getDate()
} 

const getfirstDay = month => {
  const firstDay = new Date(year, month, 1)
  return firstDay.getDay()
}

const getLastDay = month => {
  const lastDay = new Date(year, month + 1, 0)
  return lastDay.getDay()
}

prev.addEventListener('click', () => {
  nav--
  loadDate(nav)
  loadCalendar(nav)
})
next.addEventListener('click', () => {
  nav++
  loadDate(nav)
  loadCalendar(nav)
})

loadDate(currentMonth)
loadSelectedDay(currentMonth, today)
loadCalendar(currentMonth)