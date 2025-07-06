"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, CheckCircle, XCircle, RotateCcw, BookOpen, Target, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

const QuizSkeleton = () => (
  <Card className="w-full max-w-4xl mx-auto">
    <CardContent className="pt-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
)

function QuizGenerator({ courseId, courseTitle }) {
  const [quiz, setQuiz] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [error, setError] = useState(null)

  const generateQuiz = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      console.log("Generating quiz for courseId:", courseId)

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()
      console.log("Quiz API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz")
      }

      setQuiz(data.quiz)
      setCurrentQuestion(0)
      setSelectedAnswers({})
      setShowResults(false)
      setQuizStarted(false)
    } catch (err) {
      console.error("Quiz generation error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 }

    const correct = quiz.questions.reduce((acc, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? acc + 1 : acc
    }, 0)

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    }
  }

  const resetQuiz = () => {
    setQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setError(null)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Debug: Log the current state
  console.log("QuizGenerator state:", { quiz, isGenerating, error, courseId })

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={generateQuiz} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Initial state - no quiz generated yet
  if (!quiz) {
    return isGenerating ? (
      <QuizSkeleton />
    ) : (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6" />
            AI-Powered Quiz Generator
          </CardTitle>
          <CardDescription>
            Generate intelligent quiz questions based on your {courseTitle || "course"} content using advanced AI
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Concept-based Questions</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span>Practical Applications</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Varying Difficulty</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            {courseTitle ? `Ready to test your knowledge of "${courseTitle}"?` : "Ready to test your course knowledge?"}
          </p>
          <Button onClick={generateQuiz} disabled={isGenerating} size="lg" className="min-w-[200px]">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Quiz overview - before starting
  if (!quizStarted) {
    const difficultyStats = quiz.questions.reduce(
      (acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
        return acc
      },
      { easy: 0, medium: 0, hard: 0 },
    )

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {quiz.quizTitle}
          </CardTitle>
          <CardDescription>
            Course: {quiz.courseTitle}
            {quiz.courseLevel && ` • Level: ${quiz.courseLevel}`}
            {quiz.courseCategory && ` • Category: ${quiz.courseCategory}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{quiz.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{difficultyStats.easy}</div>
                <div className="text-sm text-muted-foreground">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{difficultyStats.medium}</div>
                <div className="text-sm text-muted-foreground">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{difficultyStats.hard}</div>
                <div className="text-sm text-muted-foreground">Hard</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quiz Coverage:</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(quiz.questions.map((q) => q.chapterName))).map((chapter) => (
                  <Badge key={chapter} variant="outline">
                    {chapter}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground">
              This AI-generated quiz covers React concepts including components, props, hooks, JSX, and best practices.
              Questions range from basic definitions to practical applications.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={startQuiz} size="lg">
            Start Quiz
          </Button>
          <Button onClick={resetQuiz} variant="outline">
            Generate New Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Results page
  if (showResults) {
    const score = calculateScore()
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Quiz Complete!
          </CardTitle>
          <CardDescription>Here are your detailed results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{score.percentage}%</div>
              <p className="text-muted-foreground">
                You got {score.correct} out of {score.total} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Answers:</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                            <Badge variant="outline">{question.chapterName}</Badge>
                          </div>
                          <p className="font-medium mb-3">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Your answer:</span>{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {question.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                              </p>
                            )}
                            <p className="text-muted-foreground">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Topic:</span> {question.topic}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button onClick={resetQuiz}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Generate New Quiz
          </Button>
          <Button onClick={startQuiz} variant="outline">
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Quiz taking interface
  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge className={getDifficultyColor(currentQ.difficulty)}>{currentQ.difficulty}</Badge>
              <span>•</span>
              <span>{currentQ.chapterName}</span>
              <span>•</span>
              <span className="text-xs">{currentQ.topic}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Progress</div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-medium leading-relaxed">{currentQ.question}</h3>

          <RadioGroup
            value={selectedAnswers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, Number.parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`q${currentQ.id}-option-${index}`} />
                <Label htmlFor={`q${currentQ.id}-option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={previousQuestion} disabled={currentQuestion === 0} variant="outline">
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={submitQuiz} disabled={selectedAnswers[currentQ.id] === undefined}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={selectedAnswers[currentQ.id] === undefined}>
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default memo(QuizGenerator)
