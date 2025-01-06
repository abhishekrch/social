import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
    <>
    <AuthProvider>
    <div className="pt-40">
      Social
    </div>
    </AuthProvider>
    </>
  )
}

export default App
