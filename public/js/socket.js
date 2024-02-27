const clientStatusElement = document.getElementById('status')
const loadingElement = document.getElementById('loading')
const clientId = localStorage.getItem('@socket:client-id')
const socket = io('', {
  auth: {
    clientId
  }
})

socket.on('connected', (data) => {
  console.log('connected', data)
  let clientId = ''
  clientId = data.clientId
  localStorage.setItem('@socket:client-id', clientId)

  setTimeout(() => {
    clientStatusElement.classList.remove('hidden')
    loadingElement.remove()
  }, 400)
})

socket.on('join', (data) => {
  if (data.clientId === clientId) {
    const statusElement = document.getElementById('status')
    const clientInfoElement = document.getElementById('client-info')
    const endOfChat = document.getElementById('end-of-chat')

    statusElement.classList.remove('hidden')
    clientInfoElement.innerText = data.clientUsername
    if (endOfChat) {
      endOfChat.scrollIntoView()
    }
  } else {
    const username = data.clientUsername
    const toastHTML = `<div id="toast-${clientId}" class="absolute top-16 right-4 bg-brand-primary text-zinc-950 font-bold p-4 rounded-lg border border-zinc-900">${username} entrou</div>`

    document.body.insertAdjacentHTML('beforeend', toastHTML)
    setTimeout(() => {
      document.getElementById(`toast-${clientId}`).remove()
    }, 3000)
  }
})

socket.on('leave', (data) => {
  console.log('leave', data)
})

socket.on('message', (data) => {
  const messageData = data.message
  const messageClientId = String(data.clientId)
  const messageClientUsername = String(data.username)
  const selfMessageBubble = document.createElement('div')
  selfMessageBubble.classList.add('bg-gradient-to-b', 'from-brand-primary/60', 'to-brand-secondarydark/60', 'text-zinc-950', 'p-2', 'rounded-lg', 'self-end', 'rounded-tr-none', 'max-w-[65%]')
  selfMessageBubble.setAttribute('data-client-id', messageClientId)
  selfMessageBubble.setAttribute('data-client-username', messageClientUsername)
  selfMessageBubble.innerHTML = `<p class="text-zinc-200">${messageData}</p>`

  const otherMessageBubble = document.createElement('div')
  otherMessageBubble.classList.add('bg-zinc-900', 'text-zinc-950', 'p-2', 'rounded-lg', 'self-start', 'rounded-tl-none', 'max-w-[65%]')
  otherMessageBubble.setAttribute('data-client-id', messageClientId)
  otherMessageBubble.setAttribute('data-client-username', messageClientUsername)
  otherMessageBubble.innerHTML = `<div class="flex flex-col items-start">
    <p title="${messageClientUsername}" class="font-bold text-xs text-brand-primary">${messageClientUsername}</p>
    <p class="text-zinc-200">${messageData}</p>
  </div>`

  const chatMessages = document.getElementById('chat-messages')
  const clientId = localStorage.getItem('@socket:client-id')
  if (messageClientId === clientId) {
    chatMessages.appendChild(selfMessageBubble)
  } else {
    chatMessages.appendChild(otherMessageBubble)
  }
  const oldEndOfChat = document.getElementById('end-of-chat')
  if (oldEndOfChat) oldEndOfChat.remove()
  const endOfChat = document.createElement('div')
  endOfChat.id = 'end-of-chat'
  chatMessages.appendChild(endOfChat)
  document.getElementById('end-of-chat').scrollIntoView()
})
export default socket
