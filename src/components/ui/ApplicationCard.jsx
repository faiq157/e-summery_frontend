import { color, motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const ApplicationCard = ({ icon, title, linkTo }) => {
  return (
    <Link to={linkTo}>
      <motion.div
        className="cursor-pointer"
        whileTap={{scale: 0.9}}
      whileHover={{ 
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 } 
                }}
         transition={{ duration: 0.3 }}
      >
        <Card className="hover:bg-secondary ">
          <CardHeader>
            <CardTitle className="flex justify-center items-center">
               <motion.div  whileHover={{ 
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 400, damping: 10 } 
                }}>
                {icon} 
              </motion.div>
            </CardTitle>
            <CardDescription className="flex justify-center text-2xl items-center">
              {title}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ApplicationCard;
