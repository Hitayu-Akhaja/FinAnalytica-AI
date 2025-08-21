import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-primary-400">Me</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Data Scientist and Business Analytics professional passionate about leveraging AI/ML to drive data-driven insights and create innovative solutions for business intelligence and predictive modeling.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-dark-700">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Image Placeholder */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Profile Details */}
            <div className="flex-1 text-center lg:text-left">
                             <h2 className="text-3xl font-bold text-white mb-4">Hitayu Akhaja</h2>
               <p className="text-primary-400 text-lg mb-6">Data Scientist & Business Analytics Professional</p>
              
              <div className="space-y-4">
                                 <div className="flex items-center justify-center lg:justify-start gap-3">
                   <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                   </svg>
                   <span className="text-gray-300">hitayuhasmukh.akhaja@utdallas.edu</span>
                 </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                                     <span className="text-gray-300">Dallas, Texas</span>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Available for opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Technical Skills
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Python</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Machine Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Large Language Models (LLMs)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Multi-Agent Systems (CrewAI)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">RAG (Retrieval-Augmented Generation)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">API Development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Docker & Containerization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">MLOps & Model Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">SQL & Data Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-gray-300">Data Visualization</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Education & Certifications
            </h3>
            <div className="space-y-4">
                             <div className="border-l-4 border-primary-400 pl-4">
                 <h4 className="text-white font-semibold">Master of Science, Business Analytics & AI</h4>
                 <p className="text-gray-400 text-sm">The University of Texas at Dallas • Expected May 2026</p>
               </div>
               <div className="border-l-4 border-primary-400 pl-4">
                 <h4 className="text-white font-semibold">Bachelor of Engineering, Computer Engineering</h4>
                 <p className="text-gray-400 text-sm">Gujarat Technological University • May 2024</p>
               </div>
               <div className="border-l-4 border-primary-400 pl-4">
                 <h4 className="text-white font-semibold">Machine Learning Specialization</h4>
                 <p className="text-gray-400 text-sm">Stanford online & DeepLearning.ai</p>
               </div>
               <div className="border-l-4 border-primary-400 pl-4">
                 <h4 className="text-white font-semibold">Deep Learning Specialization</h4>
                 <p className="text-gray-400 text-sm">Stanford online & DeepLearning.ai</p>
               </div>
            </div>
          </div>
        </div>

                 {/* Experience Section */}
         <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700 mb-12">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
             <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
               <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
             </svg>
             Professional Experience
           </h3>
           <div className="space-y-6">
                          <div className="border-l-4 border-primary-400 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-white font-semibold text-lg">Data Scientist</h4>
                  <span className="text-primary-400 text-sm">January 2024 - April 2024</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">BrainyBeam Pvt. Ltd</p>
                <p className="text-gray-300">
                  Developed heart disease prediction models using Random Forest, XGBoost, and SVM, improving diagnostic accuracy by 35%. 
                  Streamlined ETL pipelines reducing preprocessing time by 66% and implemented AWS cloud solutions for ML model deployment.
                </p>
              </div>
           </div>
         </div>

         {/* Academic Projects Section */}
         <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700 mb-12">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
             <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
               <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             Academic Projects
           </h3>
           <div className="space-y-6">
             <div className="border-l-4 border-primary-400 pl-6">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                 <h4 className="text-white font-semibold text-lg">Plant Disease Detection System</h4>
                 <span className="text-primary-400 text-sm">2023 - 2024</span>
               </div>
               <p className="text-gray-400 text-sm mb-2">Computer Vision • Deep Learning • Transfer Learning</p>
               <p className="text-gray-300 mb-3">
                 Built high-accuracy plant disease detection model (90% accuracy) using MobileNet_v2 and Transfer Learning. 
                 Implemented real-time image processing for agricultural applications.
               </p>
               <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">TensorFlow</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">MobileNet_v2</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">Transfer Learning</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">OpenCV</span>
               </div>
             </div>
             
             

             <div className="border-l-4 border-primary-400 pl-6">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                 <h4 className="text-white font-semibold text-lg">Financial Portfolio Analysis AI</h4>
                 <span className="text-primary-400 text-sm">2024 - Present</span>
               </div>
               <p className="text-gray-400 text-sm mb-2">Multi-Agent AI • LLMs • Financial Analysis</p>
               <p className="text-gray-300 mb-3">
                 Built comprehensive financial analysis platform using CrewAI multi-agent system with specialized agents for market analysis, 
                 technical analysis, risk assessment, and investment recommendations.
               </p>
               <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">CrewAI</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">Groq LLM</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">React</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">Flask API</span>
               </div>
             </div>

             <div className="border-l-4 border-primary-400 pl-6">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                 <h4 className="text-white font-semibold text-lg">Heart Disease Prediction System</h4>
                 <span className="text-primary-400 text-sm">2023 - 2024</span>
               </div>
               <p className="text-gray-400 text-sm mb-2">Machine Learning • Healthcare • Predictive Modeling</p>
               <p className="text-gray-300 mb-3">
                 Developed ensemble model using Random Forest, XGBoost, and SVM for heart disease prediction. 
                 Achieved 35% improvement in diagnostic accuracy compared to baseline models.
               </p>
               <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">Scikit-learn</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">XGBoost</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">Random Forest</span>
                 <span className="px-3 py-1 bg-primary-400/20 text-primary-400 text-xs rounded-full">SVM</span>
               </div>
             </div>
           </div>
         </div>

        {/* Contact Section */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-dark-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Get In Touch
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                                 <span className="text-gray-300">hitayuhasmukh.akhaja@utdallas.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                                 <span className="text-gray-300">linkedin.com/in/hitayu-akhaja</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                                 <span className="text-gray-300">+1 (945) 308-8508</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Available for remote work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
