import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaLongArrowAltRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function OutputButtons({ onReset, onEdit }) {

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/modifica', { state: { invoice: output } });
    }

    const buttons = [
        {
            icon: <FaTrash />,
            text: "Svuota",
            action: onReset,
            danger: true,
        },
        {
            icon: <FaEdit />,
            text: "Modifica",
            action: onEdit
        },
        {
            icon: <FaLongArrowAltRight />,
            text: "Avanti",
            action: () => alert("URL Successivo"),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25, // Delay tra i bottoni
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 2,
                ease: [0.16, 1, 0.3, 1]  // ease-out-back
            },
        },
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 flex flex-col sm:flex-row gap-4 justify-center"
        >
            {buttons.map((btn, i) => (
                <motion.button
                    key={i}
                    onClick={btn.action}
                    variants={buttonVariants}
                    //initial="hidden"
                    //animate="visible"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${btn.danger
                        ? "border-gray-300 hover:bg-red-100 text-red-600"
                        : "border-gray-300 hover:bg-gray-100"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {btn.icon} {btn.text}
                </motion.button>
            ))}
        </motion.div>
    );
}
