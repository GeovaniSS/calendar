const date = new Date()
const currentYear = date.getFullYear()
const currentMonth = date.getMonth()

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
let nav = currentMonth

const calendar = document.querySelector('.month-days') 

const loadDate = (year, month) => {
  const dateElement = document.querySelector('.date')
  dateElement.innerText = getDate(year, month)

  // Abril, 1
  const selectedDay = document.querySelector('.selected-day')
  selectedDay.innerText = `${new Date(year, month).toLocaleDateString('pt-BR', {month: 'long'})}, ${date.getDate()}`

  currentWeekDay(month)
}

const currentWeekDay = (month) => {
  const weekDays = document.querySelectorAll('.week-days div')
  const currentWeekDay = date.getDay()

  weekDays.forEach((weekDay, i) => {
    weekDay.classList.remove('current-week--day')
    if (i === currentWeekDay && month === currentMonth) {
      weekDay.classList.add('current-week--day')
    }
  })
}

const loadCalendar = (year, month) => {
  calendar.innerText = ''
  const totalMonthDays = getTotalMonthDays(year, month)
  const totalPreviousMonthDays = getTotalMonthDays(year, month - 1)

  const firstDay = getfirstDay(year, month) - 1 
  const lastDay = getLastDay(year, month) + 1
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
    if(i === today && month === currentMonth) monthDayElement.classList.add('today')
    calendar.appendChild(monthDayElement)
  }

  // Load Next Month Days
  for (let i = 1; i <= 7 - lastDay; i++) {
    const nextMonthDayElement = createMonthDayElement(i)
    nextMonthDayElement.classList.add('next-date')
    calendar.appendChild(nextMonthDayElement)
  }

  const days = document.querySelectorAll('.month-days div')
  const selectedDay = document.querySelector('.selected-day')

  days.forEach((day) => day.addEventListener('click', () => {
    if (day.classList.contains('prev-date')) return selectedDay.innerText = 
    getSelectedDate(month - 1, day.innerText)
    
    if (day.classList.contains('next-date')) return selectedDay.innerText = 
    getSelectedDate(month + 1, day.innerText)
    
    selectedDay.innerText = getSelectedDate(month, day.innerText)
  }))
}

const createMonthDayElement = day => {
  const monthDayElement = document.createElement('div')
  monthDayElement.innerText = day

  return monthDayElement
}

const getDate = (year, month) => {
  const date = new Date(year, month)
  return date.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'}).split(' de ').join(' ')
}

const getSelectedDate = (month, day) => {
  const date = new Date(currentYear, month, day)
  return `${date.toLocaleDateString('pt-BR', {month: 'long'})}, ${date.toLocaleDateString('pt-BR', {day: 'numeric'})}`
}

const getTotalMonthDays = (year, month) => {
  const totalMonthDays = new Date(year, month + 1, 0)
  return totalMonthDays.getDate()
} 

const getfirstDay = (year, month) => {
  const firstWeekDay = new Date(year, month, 1)
  return firstWeekDay.getDay()
}

const getLastDay = (year, month) => {
  const lastWeekDay = new Date(year, month + 1, 0)
  return lastWeekDay.getDay()
}

prev.addEventListener('click', () => {
  nav--
  loadDate(currentYear, nav)
  loadCalendar(currentYear, nav)
})
next.addEventListener('click', () => {
  nav++
  loadDate(currentYear, nav)
  loadCalendar(currentYear, nav)
})

loadDate(currentYear, currentMonth)
loadCalendar(currentYear, currentMonth)

// const event = {
//   month: 2, 
//   day: 31, 
//   hour: '14:00 - 15:00',
//   title: 'Gestão de TI',
//   description: 'Faculdade'
// }