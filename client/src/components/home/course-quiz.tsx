import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Building, 
  BarChart, 
  Rocket, 
  Clock, 
  Video, 
  File, 
  MicVocal,
  ArrowRight,
  ArrowLeft,
  Check,
  Star
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type QuizStep = 1 | 2 | 3 | 'result';

interface QuizOption {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const quizSteps = {
  1: {
    question: "What's your primary goal?",
    options: [
      {
        id: 'money',
        icon: <DollarSign className="text-2xl mb-3 text-success" />,
        title: 'Make Money Now',
        description: 'I need to start earning additional income as soon as possible'
      },
      {
        id: 'business',
        icon: <Building className="text-2xl mb-3 text-accent" />,
        title: 'Build a Business',
        description: 'I want to create a sustainable business that generates long-term value'
      },
      {
        id: 'investing',
        icon: <BarChart className="text-2xl mb-3 text-primary" />,
        title: 'Grow My Wealth',
        description: 'I want to make smart investments to build long-term wealth'
      },
      {
        id: 'productivity',
        icon: <Rocket className="text-2xl mb-3 text-foreground" />,
        title: 'Boost Productivity',
        description: 'I want to accomplish more in less time using modern tools and AI'
      }
    ]
  },
  2: {
    question: 'How much time can you dedicate weekly?',
    options: [
      {
        id: 'minimal',
        title: '1-3 hours/week',
        description: "I'm very busy but can dedicate some time"
      },
      {
        id: 'moderate',
        title: '4-7 hours/week',
        description: 'I can dedicate consistent time each week'
      },
      {
        id: 'significant',
        title: '8-15 hours/week',
        description: 'I have significant time to invest in learning'
      },
      {
        id: 'extensive',
        title: '15+ hours/week',
        description: "I'm fully committed and can dedicate substantial time"
      }
    ]
  },
  3: {
    question: 'Your experience level?',
    options: [
      {
        id: 'beginner',
        title: 'Complete Beginner',
        description: "I'm just starting and need step-by-step guidance"
      },
      {
        id: 'some-knowledge',
        title: 'Some Knowledge',
        description: 'I understand basics but need structured learning'
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        description: 'I have experience but want to enhance my skills'
      },
      {
        id: 'advanced',
        title: 'Advanced',
        description: "I'm looking for advanced strategies and techniques"
      }
    ]
  }
};

const recommendationMapping: Record<string, string> = {
  'money-minimal-beginner': 'student-money-making',
  'money-minimal-some-knowledge': 'student-money-making',
  'money-moderate-beginner': 'student-money-making',
  'money-moderate-some-knowledge': 'student-money-making',
  'money-significant-intermediate': 'business-starter',
  'money-extensive-intermediate': 'business-starter',
  'money-extensive-advanced': 'business-starter',
  
  'business-minimal-beginner': 'student-money-making',
  'business-moderate-beginner': 'business-starter',
  'business-moderate-some-knowledge': 'business-starter',
  'business-significant-intermediate': 'business-starter',
  'business-extensive-intermediate': 'business-starter',
  'business-extensive-advanced': 'investing-mastery',
  
  'investing-minimal-beginner': 'student-money-making',
  'investing-moderate-beginner': 'investing-mastery',
  'investing-moderate-some-knowledge': 'investing-mastery',
  'investing-significant-intermediate': 'investing-mastery',
  'investing-extensive-intermediate': 'investing-mastery',
  'investing-extensive-advanced': 'investing-mastery',
  
  'productivity-minimal-beginner': 'ai-productivity',
  'productivity-moderate-beginner': 'ai-productivity',
  'productivity-moderate-some-knowledge': 'ai-productivity',
  'productivity-significant-intermediate': 'ai-productivity',
  'productivity-extensive-intermediate': 'ai-productivity',
  'productivity-extensive-advanced': 'ai-productivity',
  
  // Default fallback
  'default': 'student-money-making'
};

const courseDetails = {
  'student-money-making': {
    title: 'Student Money Making',
    category: 'Money Making',
    description: 'Perfect for beginners who need to generate income quickly while learning essential skills. This course offers practical strategies you can implement with just a few hours per week.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    price: 499900,
    originalPrice: 999900,
    features: [
      { icon: <Clock className="mr-2 text-accent" />, text: '8 weeks' },
      { icon: <Video className="mr-2 text-accent" />, text: '24 video lessons' },
      { icon: <File className="mr-2 text-accent" />, text: '12 worksheets' },
      { icon: <MicVocal className="mr-2 text-accent" />, text: 'Community support' }
    ]
  },
  'business-starter': {
    title: 'Business Starter',
    category: 'Business',
    description: 'Launch your first business with proven frameworks for success and growth. Ideal for those with some knowledge looking to create a sustainable income source.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    price: 599900,
    originalPrice: 1199900,
    features: [
      { icon: <Clock className="mr-2 text-accent" />, text: '10 weeks' },
      { icon: <Video className="mr-2 text-accent" />, text: '32 video lessons' },
      { icon: <File className="mr-2 text-accent" />, text: '15 templates' },
      { icon: <MicVocal className="mr-2 text-accent" />, text: 'Private community' }
    ]
  },
  'investing-mastery': {
    title: 'Investing Mastery',
    category: 'Investing',
    description: 'Master stock markets, crypto, real estate, and alternative investment strategies to build long-term wealth and achieve financial freedom.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    price: 799900,
    originalPrice: 1499900,
    features: [
      { icon: <Clock className="mr-2 text-accent" />, text: '12 weeks' },
      { icon: <Video className="mr-2 text-accent" />, text: '40 video lessons' },
      { icon: <File className="mr-2 text-accent" />, text: '18 analysis tools' },
      { icon: <MicVocal className="mr-2 text-accent" />, text: 'Expert Q&A sessions' }
    ]
  },
  'ai-productivity': {
    title: 'AI Productivity',
    category: 'AI Mastery',
    description: 'Leverage AI tools to 10x your productivity and automate repetitive tasks. Perfect for those wanting to work smarter with modern technology.',
    image: 'https://pixabay.com/get/g779e6b338644b5baaa7881c0221572d16b3883bcc3661da31db875c3f8775dd6471e64881007044b1b500ba81ac5ae043bfcf452bdc08a35735dbb6b11850525_1280.jpg',
    price: 899900,
    originalPrice: 1699900,
    features: [
      { icon: <Clock className="mr-2 text-accent" />, text: '6 weeks' },
      { icon: <Video className="mr-2 text-accent" />, text: '28 video lessons' },
      { icon: <File className="mr-2 text-accent" />, text: '20 AI tools access' },
      { icon: <MicVocal className="mr-2 text-accent" />, text: 'AI tools community' }
    ]
  }
};

export function CourseQuiz() {
  const [currentStep, setCurrentStep] = useState<QuizStep>(1);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [selectedCourse, setSelectedCourse] = useState<string>('student-money-making');

  const handleOptionSelect = (step: number, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [step]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handlePrev = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 'result') resetQuiz();
  };

  const handleShowResult = () => {
    // Determine recommendation based on selections
    const key = `${selections[1]}-${selections[2]}-${selections[3]}`;
    const recommendation = recommendationMapping[key] || recommendationMapping.default;
    
    // Save the recommendation to localStorage for the explore page to use
    localStorage.setItem('recommendedCourse', recommendation);
    
    setSelectedCourse(recommendation);
    setCurrentStep('result');
  };

  const resetQuiz = () => {
    setCurrentStep(1);
    setSelections({});
  };

  const currentQuizStep = quizSteps[currentStep === 'result' ? 3 : currentStep];
  const course = courseDetails[selectedCourse];

  return (
    <section id="quiz" className="py-16 md:py-24 relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-primary-dark/5 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-inter mb-4 text-foreground">Find Your Perfect Course</h2>
            <p className="text-lg text-muted-foreground">Answer a few questions to discover which course aligns with your goals</p>
          </div>
          
          <Card className="shadow-xl animate-fadeIn">
            <CardContent className="p-6 md:p-10">
              {currentStep !== 'result' ? (
                <>
                  <h3 className="text-2xl font-bold font-inter mb-6 text-foreground">{currentQuizStep.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuizStep.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className={`p-6 h-auto flex flex-col items-start justify-start rounded-xl border ${
                          selections[currentStep as number] === option.id
                            ? 'border-accent ring-2 ring-accent/20'
                            : 'border-border'
                        }`}
                        onClick={() => handleOptionSelect(currentStep as number, option.id)}
                      >
                        {option.icon}
                        <h4 className="text-lg font-medium mb-2 text-foreground">{option.title}</h4>
                        <p className="text-sm text-muted-foreground text-left">{option.description}</p>
                      </Button>
                    ))}
                  </div>
                  <div className={`mt-8 flex ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
                    {currentStep !== 1 && (
                      <Button variant="outline" onClick={handlePrev}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    )}
                    {currentStep !== 3 ? (
                      <Button 
                        className="bg-primary-gradient"
                        onClick={handleNext}
                        disabled={!selections[currentStep as number]}
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        className="bg-primary-gradient"
                        onClick={handleShowResult}
                        disabled={!selections[3]}
                      >
                        Show My Recommendation <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-success/20 mb-4">
                      <Check className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold font-inter mb-2 text-foreground">Your Perfect Match!</h3>
                    <p className="text-lg text-muted-foreground">Based on your answers, we recommend:</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row bg-secondary dark:bg-gray-900 rounded-xl overflow-hidden">
                    <div className="md:w-2/5">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="px-2 py-1 bg-primary-light/10 text-primary-light rounded text-sm font-medium">
                          {course.category}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-foreground">4.9</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold font-inter mb-2 text-foreground">{course.title}</h3>
                      <p className="mb-4 text-muted-foreground">{course.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            {feature.icon}
                            <span className="text-sm text-foreground">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{formatPrice(course.price)}</p>
                          <p className="text-xs line-through text-muted-foreground">{formatPrice(course.originalPrice)}</p>
                        </div>
                        <Button 
                          className="bg-accent hover:bg-accent/90 text-white"
                          onClick={() => window.location.href = '/explore'}
                        >
                          Explore Courses
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={resetQuiz}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Start Again
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
