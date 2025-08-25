import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  Brain, 
  Shield, 
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  Play,
  CheckCircle,
  Globe,
  Cpu,
  Database
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced neural networks understand context and provide precise answers from your documents.',
      color: 'from-purple-500 to-pink-500',
      delay: '0ms'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses with our optimized processing engine and real-time analysis.',
      color: 'from-yellow-500 to-orange-500',
      delay: '200ms'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your documents are processed securely with end-to-end encryption and privacy protection.',
      color: 'from-green-500 to-teal-500',
      delay: '400ms'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Chat with PDFs in over 50 languages with automatic translation capabilities.',
      color: 'from-blue-500 to-indigo-500',
      delay: '600ms'
    },
    {
      icon: Cpu,
      title: 'Smart Processing',
      description: 'Advanced OCR and text extraction handles even complex document layouts perfectly.',
      color: 'from-red-500 to-pink-500',
      delay: '800ms'
    },
    {
      icon: Database,
      title: 'Memory & Context',
      description: 'Maintains conversation context and remembers previous interactions for better responses.',
      color: 'from-indigo-500 to-purple-500',
      delay: '1000ms'
    }
  ];


  const howItWorks = [
    {
      step: 1,
      title: 'Upload Your PDF',
      description: 'Simply drag and drop or select your PDF document. We support files up to 100MB.',
      icon: FileText
    },
    {
      step: 2,
      title: 'AI Processing',
      description: 'Our advanced AI analyzes your document structure, content, and context in seconds.',
      icon: Brain
    },
    {
      step: 3,
      title: 'Start Chatting',
      description: 'Ask questions in natural language and get precise answers with citations.',
      icon: MessageSquare
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Mouse Follower */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PDFChat</span>
              <div className="text-xs text-gray-400 font-medium">AI-Powered</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors relative group">
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300 font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Chat with your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                PDFs
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform any PDF into an intelligent conversation. Ask questions, get instant answers, 
              and navigate through your documents with AI-powered precision and lightning-fast responses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Start Chatting Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
              
            </div>
          </div>

        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of document interaction with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-3xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in three simple steps and unlock the power of AI-driven document analysis
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 transform -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl border border-blue-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Ready to Transform Your PDFs?
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the AI revolution and experience the future of document interaction today.
              </p>
              
              <button
                onClick={onGetStarted}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  Get Started Free
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PDFChat</span>
          </div>
          
          <p className="text-gray-400 mb-6">
            Transforming document interaction with AI-powered intelligence
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>© 2025 PDFChat. All rights reserved.</span>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
