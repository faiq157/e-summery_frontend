
import Header from "@/components/Header"

export default function Dashboardlayout({ children }) {
  return (

    <main className="w-full bg-gray-100 h-screen overflow-y-auto">
      <Header />
      {children}
    </main>
  )
}
