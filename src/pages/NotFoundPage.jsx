import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Take up full viewport height
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 1, 
        type: "spring", 
        bounce: 0.5, // Adjust bounce intensity
        repeat: Infinity, // Repeat animation indefinitely
        repeatType: "reverse" // Make it go back and forth
      }
    },
  };

  return (
    <motion.div 
      style={containerStyle}
      initial="hidden"
      animate="visible"
      className='flex flex-col justify-center items-center'
    >
       <img 
        src="./public/notfound.png" 
        alt="Disconnected" 
        className="w-72 h-72 mb-8" 
      /> 
      <motion.h1 
        variants={textVariants}
        style={{ fontSize: '3rem' }} // Adjust font size as needed
      >
        Page Not Found!
      </motion.h1>
    </motion.div>
  );
};

export default NotFoundPage;
