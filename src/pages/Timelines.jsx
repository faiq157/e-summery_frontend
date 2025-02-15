import TimelinessChart from "@/components/TimelinessChart"
import Dashboardlayout from "@/layout/Dashboardlayout"

const Timelines = () => {
  return (
    <Dashboardlayout>
        <h1 className='text-3xl bg-primary1 font-bold p-4'>TimeLines</h1>
        <div className="mt-10">
        <TimelinessChart/>
        </div>
        
    </Dashboardlayout>
  
  )
}

export default Timelines