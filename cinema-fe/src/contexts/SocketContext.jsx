import { createContext, useContext, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [client, setClient] = useState(null)

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected')
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
      },
    })

    stompClient.activate()
    setClient(stompClient)

    return () => {
      stompClient.deactivate()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ client }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
