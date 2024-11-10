const Loader = () => {
  return (
       <div className="flex items-center justify-center ">
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 w-full h-full border-8 border-t-transparent border-gradient-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-full h-full border-8 border-t-transparent border-gradient-r from-red-500 via-yellow-500 to-orange-500 rounded-full animate-spin slower"></div>
        <div className="absolute inset-0 w-full h-full border-8 border-t-transparent border-gradient-r from-green-500 via-teal-500 to-cyan-500 rounded-full animate-spin fastest"></div>
      </div>
    </div>
  )
}

export default Loader