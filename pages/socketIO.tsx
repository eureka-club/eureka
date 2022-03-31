import { NextPage } from 'next'
import { useEffect } from 'react'
import io from 'socket.io-client'

const socketIO:NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('/api/socketio')
    .finally(() => {
      const socket = io()

      socket.on('connect', () => {
        console.log('connect')
        socket.emit('hello')
    })
    
    socket.on('hello', data => {
        console.log('hello', data)
    })
    
    
    socket.emit('test','geo')
    
    socket.on('test', data => {
        console.log('test',data)
      })

      socket.on('disconnect', () => {
        console.log('disconnect')
      })

    })
  }, []) 
  return <h1>Socket.io</h1>
}

export default socketIO