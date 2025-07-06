import QuizGenerator from "@/components/quiz-generator"

export default async function QuizPage({ params }) {
  // Await params as required by Next.js 15
  const { courseId } = await params

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Course Quiz</h1>
        <p className="text-muted-foreground">
          Test your knowledge with an AI-generated quiz based on your course content
        </p>
      </div>

      <QuizGenerator courseId={courseId} />
    </div>
  )
}
