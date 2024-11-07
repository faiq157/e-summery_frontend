import { IoIosAddCircle } from "react-icons/io";
import Dashboardlayout from './../layout/Dashboardlayout'
import { FaCheckCircle } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const Home = () => {
  return (
    <div>
      <Dashboardlayout>
        <h1 className='text-3xl font-bold p-4'>Dashboard</h1>

        {/* Create a container for your cards */}
        <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
          {/* Card 1 */}
         <motion.div
         className=" cursor-pointer"
          whileHover={{ scale: 1.1 }}
              onHoverStart={() => {}}
              onHoverEnd={() => {}}
              
              > 
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-center items-center">
                  <IoIosAddCircle className="h-14 w-14" />
                </CardTitle>
                <CardDescription className="flex justify-center text-2xl items-center">
                  Create New
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Card 2 */}
           <motion.div
             className=" cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => {}}
            onHoverEnd={() => {}}> 
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-center items-center">
                <RiDraftFill className="h-14 w-14" />
              </CardTitle>
              <CardDescription className="flex justify-center text-2xl items-center">Draft</CardDescription>
            </CardHeader>
          </Card>
           </motion.div>

          {/* Card 3 */}
            <motion.div 
            className=" cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => {}}
            onHoverEnd={() => {}}> 
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-center items-center">
                <FaCheckCircle className="h-14 w-14" />
              </CardTitle>
              <CardDescription className="flex justify-center text-2xl items-center">Completed</CardDescription>
            </CardHeader>
          </Card>
            </motion.div>
        </div>
         {/* End of card container */}

      </Dashboardlayout>
    </div>
  )
}

export default Home
