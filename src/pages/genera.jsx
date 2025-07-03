import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaDownload, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import PromptInput from '../components/PromptInput';

export default function Genera() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 py-20 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Genera una fattura con l’<span className="text-purple-600">IA</span>
                </h1>
                <PromptInput />
            </div>
        </div>
    )
}