const data = new Date()

const loadWeekDays = () => {
  const weekDaysElement = document.querySelector('.week-days')
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

  weekDays.forEach((weekDay, index) => {
    const weekDayElement = createWeekDayElement(weekDay, index)
    weekDaysElement.appendChild(weekDayElement)
  })
}

const createWeekDayElement = (weekDay, index) => {
  const weekDayElement = document.createElement('div')
  weekDayElement.innerText = weekDay

  const currentWeekDay = data.getDay()
  if (index === currentWeekDay) weekDayElement.classList.add('current-week--day')

  return weekDayElement
}

const loadMonthDays = () => {
  const monthDaysElement = document.querySelector('.month-days')
  const totalMonthDaysNumber = getTotalMonthDays(2022, 3)

  for (let i = 1; i <= totalMonthDaysNumber; i++) {
    const monthDayElement = createMonthDayElement(i)
    monthDaysElement.appendChild(monthDayElement)
  }
}

const createMonthDayElement = (day) => {
  const monthDayElement = document.createElement('div')
  monthDayElement.innerText = day

  const currentDay = data.getDate()
  if(day === currentDay) monthDayElement.classList.add('current-month--day')

  return monthDayElement
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

loadWeekDays()
loadMonthDays()

// console.log(getTotalMonthDays(2022, 3))
// console.log(getfirstWeekDay(2022, 3))
// console.log(getLastWeekDay(2022, 3))