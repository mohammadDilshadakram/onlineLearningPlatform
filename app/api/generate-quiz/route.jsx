import { NextResponse } from "next/server"
import { model } from "@/lib/ai/gemini"

const QUIZ_PROMPT = `Generate a comprehensive quiz based on the provided React JS course content.
Return ONLY a valid JSON object — do NOT include any extra text, explanation, markdown, or formatting.

Create questions that test:
1. Understanding of React concepts
2. Practical application knowledge
3. Code comprehension
4. Best practices

Schema:
{
  "quizTitle": "string",
  "totalQuestions": "number",
  "questions": [
    {
      "id": "number",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "number (index of correct option, 0-3)",
      "explanation": "string (detailed explanation of the correct answer)",
      "difficulty": "string (easy/medium/hard)",
      "topic": "string (which course topic this question relates to)",
      "chapterName": "string (which chapter this question belongs to)"
    }
  ]
}

Generate 12-15 questions with varying difficulty levels:
- 40% Easy questions (basic concepts, definitions)
- 40% Medium questions (application, understanding)
- 20% Hard questions (advanced concepts, best practices)

Make sure questions cover all chapters and topics proportionally.
Include practical code-related questions where appropriate.
Ensure all options are plausible and related to React development.

Course Content:
`

export async function POST(req) {
  try {
    console.log("=== QUIZ GENERATION STARTED ===")

    const { courseId } = await req.json()
    console.log("📝 Course ID:", courseId)

    if (!courseId) {
      console.log("❌ No courseId provided")
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Import database modules
    console.log("📦 Importing database modules...")
    const { db } = await import("@/config/db")
    const { coursesTable } = await import("@/config/schema")
    const { eq } = await import("drizzle-orm")

    // Fetch course data
    console.log("🔍 Fetching course data...")
    const courseData = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId))

    if (!courseData || courseData.length === 0) {
      console.log("❌ Course not found")
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const course = courseData[0]
    console.log("✅ Course found:", course.courseTitle)
    console.log("📊 Course data keys:", Object.keys(course))

    // Handle course content - check if it's in courseJson field
    let courseContent
    if (course.courseJson && course.courseJson.course) {
      console.log("✅ Using courseJson.course structure")
      courseContent = course.courseJson.course
    } else if (course.courseContent) {
      console.log("✅ Using courseContent structure")
      if (typeof course.courseContent === "object") {
        courseContent = course.courseContent
      } else {
        courseContent = JSON.parse(course.courseContent)
      }
    } else {
      console.log("❌ No course content found")
      console.log("Available fields:", Object.keys(course))
      return NextResponse.json(
        { error: "Course content not found. Please generate course content first." },
        { status: 400 },
      )
    }

    console.log("📚 Course content structure:", {
      hasChapters: !!courseContent.chapters,
      chaptersLength: courseContent.chapters?.length,
      courseTitle: courseContent.name,
    })

    if (!courseContent.chapters || !Array.isArray(courseContent.chapters) || courseContent.chapters.length === 0) {
      console.log("❌ Course chapters not found or empty")
      return NextResponse.json({ error: "Course chapters not found or empty" }, { status: 400 })
    }

    // Prepare comprehensive course data for AI
    const courseForQuiz = {
      courseTitle: courseContent.name || course.courseTitle,
      courseDescription: courseContent.description || course.courseDescription,
      category: courseContent.category || course.category,
      level: courseContent.level || course.level,
      chapters: courseContent.chapters.map((chapter) => ({
        chapterName: chapter.chapterName,
        duration: chapter.duration,
        topics: chapter.topics || [],
      })),
    }

    console.log("🤖 Generating AI-powered quiz...")
    console.log("📚 Course structure:", {
      title: courseForQuiz.courseTitle,
      chapters: courseForQuiz.chapters.length,
      totalTopics: courseForQuiz.chapters.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0),
    })

    // Generate quiz using Gemini AI
    const prompt = QUIZ_PROMPT + JSON.stringify(courseForQuiz, null, 2)
    console.log("🔤 Prompt length:", prompt.length)

    console.log("🚀 Calling Gemini API...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()

    console.log("✅ AI response received, length:", text.length)
    console.log("📝 First 200 chars:", text.substring(0, 200))

    let quizData
    try {
      const jsonText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
      console.log("🔧 Cleaned JSON text length:", jsonText.length)
      quizData = JSON.parse(jsonText)
      console.log("✅ JSON parsed successfully")
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err)
      console.error("Raw response:", text.substring(0, 1000))
      return NextResponse.json({ error: "Failed to generate valid quiz format. Please try again." }, { status: 500 })
    }

    // Validate and enhance quiz data
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      console.log("❌ Invalid quiz structure")
      console.log("Quiz data keys:", Object.keys(quizData))
      return NextResponse.json({ error: "Invalid quiz structure generated" }, { status: 500 })
    }

    // Add metadata
    quizData.courseId = courseId
    quizData.courseTitle = courseForQuiz.courseTitle
    quizData.courseLevel = courseForQuiz.level
    quizData.courseCategory = courseForQuiz.category
    quizData.generatedAt = new Date().toISOString()
    quizData.totalQuestions = quizData.questions.length

    // Ensure all questions have required fields
    quizData.questions = quizData.questions.map((q, index) => ({
      id: q.id || index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
      topic: q.topic,
      chapterName: q.chapterName,
    }))

    console.log("✅ Quiz generated successfully!")
    console.log("📊 Quiz stats:", {
      totalQuestions: quizData.questions.length,
      difficulties: {
        easy: quizData.questions.filter((q) => q.difficulty === "easy").length,
        medium: quizData.questions.filter((q) => q.difficulty === "medium").length,
        hard: quizData.questions.filter((q) => q.difficulty === "hard").length,
      },
    })

    return NextResponse.json({
      success: true,
      quiz: quizData,
    })
  } catch (error) {
    console.error("=== QUIZ GENERATION ERROR ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)

    // More specific error messages
    let errorMessage = "Failed to generate quiz"
    if (error.message.includes("API key")) {
      errorMessage = "Invalid API key. Please check your GEMINI_API_KEY."
    } else if (error.message.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later."
    } else if (error.message.includes("model")) {
      errorMessage = "AI model error. Please try again."
    }

    return NextResponse.json(
      {
        error: errorMessage + ": " + error.message,
      },
      { status: 500 },
    )
  }
}
