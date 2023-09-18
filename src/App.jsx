import { useState } from 'react'
import { Container } from 'react-bootstrap'
import ChatApp from './ChatApp'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <h1 className="mb-5" style={{ textAlign: 'center' }}>React Live Chat App</h1>
      <ChatApp />
    </>
  )
}

export default App
