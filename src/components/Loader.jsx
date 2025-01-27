import { Player } from "@lottiefiles/react-lottie-player"

const Loader = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="text-center py-6">
        <Player
          autoplay
          loop
          src="https://lottie.host/eb7904f0-e3f7-44d8-84e6-40947912740d/DxhKI09Py7.json" // Example Lottie animation URL
          style={{ height: '200px', width: '200px' }}
        />
      </div>
    </div>
  )
}

export default Loader