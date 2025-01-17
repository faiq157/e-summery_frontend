import { motion } from "framer-motion";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";


export function NonAdminRoute({ children }) {
    const { userData } = useContext(AuthContext);
    const isAdmin = userData?.role === "admin";

    if (isAdmin) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <motion.img
                    src="https://media.giphy.com/media/3o6MbdPcxvF7Hb5G3S/giphy.gif?cid=790b76115w9qz5a1bc8fbya4hr7t2barqsao0111fgosb0qb&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                    alt="Not Authorized"
                    className="w-200 h-200 mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <motion.h1
                    className="text-3xl font-bold text-red-600 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Access Denied
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    You are not authorized to access this page.
                </motion.p>
                <motion.a
                    href="/"
                    className="mt-6 px-6 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Go Back to Home
                </motion.a>
            </motion.div>
        );
    }


    return children;
}