import React from "react";

export default function StepCard({ emoji, title, description, example, onClick }) {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-xl shadow-lg p-8 border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition min-h-[320px] flex flex-col"
        >
            <span className="text-4xl">{emoji}</span>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{title}</h3>
            <p className="text-gray-600 flex-grow">
                {description}
                {example && (
                    <span className="italic text-sm text-gray-500 block mt-2">{example}</span>
                )}
            </p>
        </div>
    )
}