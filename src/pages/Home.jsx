import { IoIosAddCircle } from "react-icons/io";
import Dashboardlayout from './../layout/Dashboardlayout'
import ApplicationCard from "@/components/ui/ApplicationCard";
import { FaCheckCircle } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
const Home = () => {
  return (
    <div>
      <Dashboardlayout>
        <h1 className='text-3xl font-bold p-4'>Dashboard</h1>
        <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
          <ApplicationCard 
            icon={<IoIosAddCircle className="h-14 w-14" />} 
            title="Create New" 
            linkTo="/create" 
          />
            <ApplicationCard 
            icon={<RiDraftFill className="h-14 w-14" />} 
            title="Draft" 
            linkTo="/draft" // Update with your actual draft route
          />
          <ApplicationCard 
            icon={<FaCheckCircle className="h-14 w-14" />} 
            title="Completed" 
            linkTo="/completed" // Update with your actual completed route
          />
        </div>
      </Dashboardlayout>
    </div>
  )
}

export default Home
