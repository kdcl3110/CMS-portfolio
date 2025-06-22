import { useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<>Je suis la</>} />
      </Routes>
    </>
  )
}

export default App
