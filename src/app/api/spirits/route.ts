import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

/**
 * Spirit Consultation API Route
 * Requirements: 10.2, 10.3 - AI-powered task generation
 * 
 * Uses OpenAI GPT-4.1-nano via AI SDK to generate task suggestions.
 */

interface SpiritRequest {
  goal: string
}

interface SpiritResponse {
  suggestions: string[]
  error?: string
}

const suggestionsSchema = z.object({
  suggestions: z.array(z.string()).describe('Array of 5 actionable task suggestions to help achieve the goal'),
})

export async function POST(request: NextRequest): Promise<NextResponse<SpiritResponse>> {
  try {
    const body = await request.json() as SpiritRequest
    
    if (!body.goal || typeof body.goal !== 'string') {
      return NextResponse.json(
        { suggestions: [], error: 'Goal description is required' },
        { status: 400 }
      )
    }
    
    const trimmedGoal = body.goal.trim()
    
    if (trimmedGoal.length === 0) {
      return NextResponse.json(
        { suggestions: [], error: 'Goal description cannot be empty' },
        { status: 400 }
      )
    }
    
    if (trimmedGoal.length > 500) {
      return NextResponse.json(
        { suggestions: [], error: 'Goal description is too long (max 500 characters)' },
        { status: 400 }
      )
    }

    const { object } = await generateObject({
      model: openai('gpt-4.1-nano'),
      schema: suggestionsSchema,
      prompt: `You are a helpful task breakdown assistant. Given the user's goal, generate exactly 5 specific, actionable task suggestions that will help them achieve it. Each task should be clear, concise, and practical.

User's goal: "${trimmedGoal}"

Generate 5 actionable tasks to help achieve this goal.`,
    })
    
    return NextResponse.json({ suggestions: object.suggestions })
  } catch (error) {
    console.error('Spirit consultation error:', error)
    return NextResponse.json(
      { suggestions: [], error: 'The spirits are unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
