const newEvent = document.querySelector('.add-event')
const cancelEvent = document.querySelector('.cancel-event')
const modal = document.querySelector('.modal-container')

newEvent.addEventListener('click', () => {
  modal.style.display = 'block'
})

cancelEvent.addEventListener('click', () => {
  modal.style.display = 'none'
})