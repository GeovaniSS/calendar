const data = new Date()
const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'] // Dias da Semana
const monthDaysElement = document.querySelector('.month-days') // Calendário

const currentWeekDay = () => {
  const weekDaysElement = document.querySelectorAll('.week-day')
  const weekDays = [...weekDaysElement]
  const currentWeekDay = data.getDay()

  weekDays.forEach((weekDay, index) => {
    if (index === currentWeekDay) weekDay.classList.add('current-week--day')  
  })
}

const loadPreviousMonthDays = (year, previousMonth, currentMonth) => {
  const totalPreviousMonthDays = getTotalMonthDays(year, previousMonth) 
  const firstWeekDay = getfirstWeekDay(year, currentMonth) - 1 

  for (let i = totalPreviousMonthDays - firstWeekDay; i <= totalPreviousMonthDays; i++) {
    const previousMonthDayElement = createPreviousMonthDayElement(i)
    monthDaysElement.appendChild(previousMonthDayElement)
  }
}

const createPreviousMonthDayElement = day => {
  const previousMonthDayElement = document.createElement('div')
  previousMonthDayElement.innerText = day
  previousMonthDayElement.classList.add('previous-month--day')

  return previousMonthDayElement
}

const loadMonthDays = (year, month) => {
  const totalMonthDays = getTotalMonthDays(year, month)

  for (let i = 1; i <= totalMonthDays; i++) {
    const monthDayElement = createMonthDayElement(i)
    monthDaysElement.appendChild(monthDayElement)
  }
}

const createMonthDayElement = day => {
  const monthDayElement = document.createElement('div')
  monthDayElement.innerText = day

  const currentDay = data.getDate()
  if(day === currentDay) monthDayElement.classList.add('current-month--day')

  return monthDayElement
}

const loadNextMonthDays = (year, month) => {
  const lastWeekDay = getLastWeekDay(year, month) + 1

  for (let i = 1; i <= weekDays.length - lastWeekDay; i++) {
    const nextMonthDayElement = createNextMonthDayElement(i)
    monthDaysElement.appendChild(nextMonthDayElement)
  }
}

const createNextMonthDayElement = day => {
  const nextMonthDayElement = document.createElement('div')
  nextMonthDayElement.innerText = day
  nextMonthDayElement.classList.add('previous-month--day')

  return nextMonthDayElement
}

const getTotalMonthDays = (year, month) => {
  const totalMonthDays = new Date(year, month, 0)
  return totalMonthDays.getDate()
} 

const getfirstWeekDay = (year, month) => {
  const firstWeekDay = new Date(year, month - 1, 1)
  return firstWeekDay.getDay()
}

const getLastWeekDay = (year, month) => {
  const lastWeekDay = new Date(year, month, 0)
  return lastWeekDay.getDay()
}

currentWeekDay()
loadPreviousMonthDays(2022, 2, 3)
loadMonthDays(2022, 3)
loadNextMonthDays(2022, 3)

// console.log(getTotalMonthDays(2022, 3))
// console.log(getfirstWeekDay(2022, 3))
// console.log(getLastWeekDay(2022, 3))