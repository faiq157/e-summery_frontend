import { Player } from "@lottiefiles/react-lottie-player"

const Approval = () => {
    return (
        <div className="flex flex-col items-center justify-center w-[100vw] h-screen ">
            <Player
                autoplay
                loop
                src="https://lottie.host/68fd04f4-eb16-48d9-aeea-6ce6d779b2d2/BLqBVz61ze.json" // Example Lottie animation URL
                style={{ height: '500px', width: '500px' }}
            />
            <p className="text-xl font-semibold mt-4">Approval is Under development</p>
        </div>
    )
}

export default Approval