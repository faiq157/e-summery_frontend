
import Header from "@/components/Header"

export default function Dashboardlayout({ children }) {
  return (

    <main className="w-full">
      <Header />
      {children}
    </main>
  )
}
