import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function OutputButtons({ onReset, onEdit }) {
    const buttons = [
        {
            icon: <FaTrash />,
            text: "Svuota tutto",
            action: onReset,
            danger: true,
        },
        {
            icon: <FaEdit />,
            text: "Rivedi e Modifica",
            action: onEdit,
            primary: true,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
        >
            {buttons.map((btn, i) => (
                <motion.button
                    key={i}
                    onClick={btn.action}
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium shadow-md transition-all active:scale-95 min-w-[200px]
                        ${btn.danger
                            ? "text-red-600 border border-red-300 bg-white hover:bg-red-50"
                            : btn.primary
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:brightness-110"
                                : "text-gray-800 border border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                >
                    <span className="text-lg">{btn.icon}</span>
                    <span>{btn.text}</span>
                </motion.button>
            ))}
        </motion.div>
    );
}
