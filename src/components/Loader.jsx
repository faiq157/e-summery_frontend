import { Player } from "@lottiefiles/react-lottie-player"

const Loader = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="text-center py-6">
        <Player
          autoplay
          loop
          src="https://lottie.host/a15973f9-71ff-4478-991f-e347980735b9/wzjT4bRVfW.json" // Example Lottie animation URL
          style={{ height: '200px', width: '200px' }}
        />
        <p className="text-xl font-semibold mt-4">Please add an application.</p>
      </div>
    </div>
  )
}

export default Loader