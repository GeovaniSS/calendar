let nav = 0
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const data = new Date()
const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'] // Dias da Semana
const monthDaysElement = document.querySelector('.month-days') // Calendário
const currentDateElement = document.querySelector('.current-date')

const clearMonthDays = () => {
  monthDaysElement.innerText = ''
}

const loadCurrentDate = () => {
  const year = data.getFullYear()
  const month = data.getMonth()
  nav = month

  currentDateElement.innerText = getCurrentDate(year, month)

  loadMonthDays(year, month)
}

const updateDate = (month) => {
  const currentDateElement = document.querySelector('.current-date')
  currentDateElement.innerText = getCurrentDate(2022, month)

  clearMonthDays()
  loadMonthDays(2022, month)
}

const currentWeekDay = () => {
  const weekDaysElement = document.querySelectorAll('.week-day')
  const weekDays = [...weekDaysElement]
  const currentWeekDay = data.getDay()

  weekDays.forEach((weekDay, index) => {
    if (index === currentWeekDay) weekDay.classList.add('current-week--day')  
  })
}

const loadMonthDays = (year, month) => {
  const totalMonthDays = getTotalMonthDays(year, month)
  const totalPreviousMonthDays = getTotalMonthDays(year, month - 1)
  const firstWeekDay = getfirstWeekDay(year, month) - 1 
  const lastWeekDay = getLastWeekDay(year, month) + 1

  for (let i = totalPreviousMonthDays - firstWeekDay; i <= totalPreviousMonthDays; i++) {
    const previousMonthDayElement = createMonthDayElement(i)
    previousMonthDayElement.classList.add('prev-date')
    monthDaysElement.appendChild(previousMonthDayElement)
  }
  
  for (let i = 1; i <= totalMonthDays; i++) {
    const monthDayElement = createMonthDayElement(i)
    const currentDay = data.getDate()
    if(i === currentDay) monthDayElement.classList.add('current-month--day')
    monthDaysElement.appendChild(monthDayElement)
  }

  for (let i = 1; i <= weekDays.length - lastWeekDay; i++) {
    const nextMonthDayElement = createMonthDayElement(i)
    nextMonthDayElement.classList.add('next-date')
    monthDaysElement.appendChild(nextMonthDayElement)
  }
}

const createMonthDayElement = day => {
  const monthDayElement = document.createElement('div')
  monthDayElement.innerText = day

  return monthDayElement
}

const getCurrentDate = (year, month) => {
  const currentDate = new Date(year, month)
  return currentDate.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})
}

const getTotalMonthDays = (year, month) => {
  const totalMonthDays = new Date(year, month + 1, 0)
  return totalMonthDays.getDate()
} 

const getfirstWeekDay = (year, month) => {
  const firstWeekDay = new Date(year, month, 1)
  return firstWeekDay.getDay()
}

const getLastWeekDay = (year, month) => {
  const lastWeekDay = new Date(year, month + 1, 0)
  return lastWeekDay.getDay()
}

prev.addEventListener('click', () => {
  nav--
  updateDate(nav)
})
next.addEventListener('click', () => {
  nav++
  updateDate(nav)
})

loadCurrentDate()
currentWeekDay()