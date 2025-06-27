import { useState } from 'react';

function ChapterTopicList({ course }) {
    const courseLayout = course?.courseJson?.course;
    const [expandedChapter, setExpandedChapter] = useState(null);
    const [showChapters, setShowChapters] = useState(false);

    const toggleChapters = () => {
        setShowChapters(!showChapters);
        setExpandedChapter(null);
    };

    const toggleChapter = (index) => {
        setExpandedChapter(expandedChapter === index ? null : index);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Course Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Chapters and Topics</h1>
                <button 
                    onClick={toggleChapters}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                    {showChapters ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Hide Chapters
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Explore Chapters
                        </span>
                    )}
                </button>
            </div>

            {/* Threaded Mind Map View */}
            {showChapters && (
                <div className="relative">
                    {/* Central Thread Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-transparent transform -translate-x-1/2"></div>

                    <div className="space-y-20 py-8">
                        {courseLayout?.chapters.map((chapter, index) => (
                            <div key={index} className="relative group">
                                {/* Chapter Node */}
                                <div 
                                    onClick={() => toggleChapter(index)}
                                    className={`relative mx-auto w-72 p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 z-10 ${
                                        expandedChapter === index 
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white scale-105 shadow-xl'
                                            : 'bg-white hover:bg-gray-50 group-hover:shadow-md'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="font-bold text-lg">Chapter {index + 1}</div>
                                        <div className="text-sm mt-1">{chapter.chapterName}</div>
                                        <div className="text-xs mt-3 flex justify-between opacity-80">
                                            <span>⏱️ {chapter.duration}</span>
                                            <span>📚 {chapter.topics?.length} topics</span>
                                        </div>
                                    </div>
                                    {/* Chapter connector dot */}
                                    <div className={`absolute -bottom-5 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 ${
                                        expandedChapter === index ? 'bg-blue-500' : 'bg-blue-300'
                                    }`}></div>
                                </div>

                                {/* Topics Branch */}
                                {expandedChapter === index && (
                                    <div className="mt-8 transition-all duration-500">
                                        <div className="relative">
                                            {/* Branch Curve */}
                                            <svg 
                                                className="absolute left-1/2 -top-6 w-24 h-12 text-gray-200 transform -translate-x-1/2"
                                                viewBox="0 0 100 50"
                                                preserveAspectRatio="none"
                                            >
                                                <path 
                                                    d="M0,50 Q50,0 100,50" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 px-8">
                                                {chapter?.topics.map((topic, topicIndex) => (
                                                    <div 
                                                        key={topicIndex} 
                                                        className="relative bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group/topic"
                                                    >
                                                        {/* Topic Connector */}
                                                        <div className="absolute -top-5 left-1/2 h-5 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                                                        <div className="flex items-start">
                                                            <span className="mr-3 font-medium text-blue-600 bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center">
                                                                {topicIndex + 1}
                                                            </span>
                                                            <span className="text-gray-700">{topic}</span>
                                                        </div>
                                                        {/* Hover effect dot */}
                                                        <div className="absolute -top-5 left-1/2 w-2 h-2 rounded-full bg-blue-300 transform -translate-x-1/2 opacity-0 group-hover/topic:opacity-100 transition-opacity"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterTopicList;