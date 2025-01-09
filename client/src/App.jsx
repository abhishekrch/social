import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Register from "./pages/Register"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
