export default function StepCard({ emoji, title, description, example, onClick }) {
    return (
        <div onClick={onClick} className="cursor-pointer bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300 ease-in-out fade-in min-h-[280px] flex flex-col">
            <span className="text-4xl">{emoji}</span>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{title}</h3>
            <p className="text-gray-600 flex-grow text-sm sm:text-base leading-relaxed">
                {description}
                {example && (
                    <span className="italic text-sm text-gray-500 block mt-2">{example}</span>
                )}
            </p>
        </div>
    )
}