import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GuideStep {
  title: string;
  content: string;
  actionRequired?: boolean;
  checklistItems?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  category: string;
  quiz_questions?: QuizQuestion[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface InteractiveGuideProps {
  guideId: string;
  onComplete?: () => void;
  onBack?: () => void;
}

export default function InteractiveGuide({ guideId, onComplete, onBack }: InteractiveGuideProps) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuide();
    loadProgress();
  }, [guideId]);

  const fetchGuide = async () => {
    try {
      // Mock guide data - replace with actual API call
      const mockGuide: Guide = {
        id: guideId,
        title: 'How to Register as a Voter',
        description: 'Complete step-by-step guide for voter registration in South Africa',
        category: 'voter_registration',
        steps: [
          {
            title: 'Check Your Eligibility',
            content: 'To register as a voter in South Africa, you must be:\n• 18 years or older\n• A South African citizen\n• Not declared mentally unfit by a court',
            checklistItems: ['I am 18 years or older', 'I am a South African citizen', 'I have not been declared mentally unfit']
          },
          {
            title: 'Gather Required Documents',
            content: 'You will need the following documents:\n• Your South African ID document (green barcoded ID book or smart ID card)\n• Proof of address (utility bill, bank statement, or affidavit)',
            actionRequired: true,
            checklistItems: ['ID document ready', 'Proof of address obtained']
          },
          {
            title: 'Find Registration Point',
            content: 'You can register at:\n• IEC offices\n• Mobile registration points\n• Special registration weekends\n\nUse the IEC website to find the nearest registration point.',
            actionRequired: true
          },
          {
            title: 'Complete Registration',
            content: 'At the registration point:\n• Present your documents\n• Complete the registration form\n• Verify your details\n• Receive your registration confirmation',
            actionRequired: true
          }
        ],
        quiz_questions: [
          {
            question: 'What is the minimum age to register as a voter in South Africa?',
            options: ['16 years', '18 years', '21 years', '25 years'],
            correct_answer: 1,
            explanation: 'You must be 18 years or older to register as a voter in South Africa.'
          },
          {
            question: 'Which document is NOT required for voter registration?',
            options: ['ID document', 'Proof of address', 'Birth certificate', 'All are required'],
            correct_answer: 2,
            explanation: 'A birth certificate is not required. You only need your ID document and proof of address.'
          }
        ]
      };
      
      setGuide(mockGuide);
      setCompletedSteps(new Array(mockGuide.steps.length).fill(false));
    } catch (error) {
      console.error('Error fetching guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const raw = localStorage.getItem(`guide-progress:${guideId}`);
      if (raw) {
        const saved = JSON.parse(raw) as { current_step: number; completed_steps: boolean[] };
        if (Array.isArray(saved.completed_steps)) {
          setCompletedSteps(saved.completed_steps);
        }
        if (typeof saved.current_step === 'number') {
          setCurrentStep(saved.current_step);
        }
      }
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }
  };

  const saveProgress = async () => {
    // Persist locally and optionally send to backend
    try {
      localStorage.setItem(
        `guide-progress:${guideId}`,
        JSON.stringify({ guide_id: guideId, current_step: currentStep, completed_steps: completedSteps })
      );
    } catch (e) {
      console.error('Error saving progress locally:', e);
    }

    try {
      await supabase.functions.invoke('knowledge-api/progress', {
        body: {
          guide_id: guideId,
          current_step: currentStep,
          completed_steps: completedSteps,
        },
      });
    } catch (error) {
      // Optional backend sync failure should not block UX
      console.warn('Progress sync failed (continuing offline):', error);
    }
  };

  const markStepComplete = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    saveProgress();
  };

  const nextStep = () => {
    if (currentStep < (guide?.steps.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    } else if (guide?.quiz_questions && guide.quiz_questions.length > 0) {
      setShowQuiz(true);
    } else {
      onComplete?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitQuiz = () => {
    if (!guide?.quiz_questions) return;
    
    let score = 0;
    quizAnswers.forEach((answer, index) => {
      if (answer === guide.quiz_questions![index].correct_answer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / guide.quiz_questions.length) * 100);
    setQuizScore(percentage);
    
    if (percentage >= 70) {
      onComplete?.();
    }
  };

  if (loading) {
    return <div>Loading guide...</div>;
  }

  if (!guide) {
    return <div>Guide not found</div>;
  }

  const progress = ((currentStep + 1) / guide.steps.length) * 100;

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Check</CardTitle>
            <CardDescription>Test your understanding of the registration process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {guide.quiz_questions?.map((question, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <h3 className="font-medium">{question.question}</h3>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        onChange={() => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[qIndex] = oIndex;
                          setQuizAnswers(newAnswers);
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            {quizScore !== null && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Quiz Result: {quizScore}%</span>
                </div>
                {quizScore >= 70 ? (
                  <Badge variant="default">Passed! You can proceed.</Badge>
                ) : (
                  <Badge variant="destructive">Please review the guide and try again.</Badge>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowQuiz(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Guide
              </Button>
              <Button onClick={submitQuiz} disabled={quizAnswers.length !== guide.quiz_questions?.length}>
                Submit Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>
        <Badge variant="secondary">{guide.category}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription>{guide.description}</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentStep + 1} of {guide.steps.length}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
              {currentStep + 1}
            </div>
            {guide.steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{guide.steps[currentStep].content}</p>
          </div>

          {guide.steps[currentStep].checklistItems && (
            <div className="space-y-2">
              <h4 className="font-medium">Checklist:</h4>
              {guide.steps[currentStep].checklistItems!.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {completedSteps[currentStep] ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {guide.steps[currentStep].actionRequired && !completedSteps[currentStep] && (
                <Button variant="outline" onClick={markStepComplete}>
                  Mark Complete
                </Button>
              )}
              <Button
                onClick={nextStep}
                disabled={guide.steps[currentStep].actionRequired && !completedSteps[currentStep]}
              >
                {currentStep === guide.steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}