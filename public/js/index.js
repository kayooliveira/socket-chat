import socket from './socket.js'
const clientId = localStorage.getItem('@socket:client-id')
let clientUsername = localStorage.getItem('@socket:client-username')

const loginElement = document.getElementById('login')
const loginFormElement = document.getElementById('login-form')
const clientInfoElement = document.getElementById('client-info')
const sendMessageFormElement = document.getElementById('chat-form')

if ((clientId && !clientUsername) ?? (!clientId && !clientUsername)) {
  loginFormElement.addEventListener('submit', (event) => {
    try {
      event.preventDefault()

      const username = document.getElementById('username-input')?.value

      if (!username || username.trim() === '') {
        alert('Por favor, digite um nome válido!')
        return
      }

      clientUsername = username

      clientInfoElement.innerHTML = clientUsername

      localStorage.setItem('@socket:client-username', clientUsername)

      loginElement.remove()
      socket.emit('join', {
        clientId,
        clientUsername
      })
    } catch (error) {
      alert('Erro desconhecido, por favor, contate o suporte!')
      console.error(error)
    }
  })
}

const logoutButtonElement = document.getElementById('logout')

logoutButtonElement.addEventListener('click', (event) => {
  event.preventDefault()

  const confirmLogout = confirm('Tem certeza que deseja sair?')

  if (confirmLogout) {
    localStorage.clear()
    window.location.reload()
  }
})

if (clientId && clientUsername) {
  loginElement.remove()
  socket.emit('join', {
    clientId,
    clientUsername
  })
  clientInfoElement.innerHTML = clientUsername
}

sendMessageFormElement.addEventListener('submit', (event) => {
  try {
    event.preventDefault()
    const messageElement = document.getElementById('message')
    const messageData = messageElement?.value
    if (!messageData || messageData.trim() === '') return

    socket.emit('message', {
      clientId,
      message: messageData,
      username: clientUsername
    })
    messageElement.value = ''
  } catch (error) {
    console.error(error)
    alert('Ocorreu um erro ao enviar a mensagem, por favor, contate o suporte!')
  }
})
