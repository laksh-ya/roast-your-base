import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const COC_API_TOKEN = process.env.COC_API_TOKEN || "your-coc-api-token"

export async function POST(request: NextRequest) {
  try {
    const { playerCode, baseJson } = await request.json()

    if (!playerCode) {
      return NextResponse.json({ error: "Player code is required" }, { status: 400 })
    }

    // Clean the player tag (remove # if present and add it back)
    const cleanTag = playerCode.replace("#", "")
    const playerTag = `%23${cleanTag}`

    // Fetch player data from COC API
    let playerData
    try {
      const response = await fetch(`https://cocproxy.royaleapi.dev/v1/players/${playerTag}`, {
        headers: {
          Authorization: `Bearer ${COC_API_TOKEN}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("COC API Error:", response.status, errorText)

        if (response.status === 404) {
          throw new Error("Player not found. Check your player tag and try again.")
        } else if (response.status === 403) {
          throw new Error("API access denied. Please check API configuration.")
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.")
        } else {
          throw new Error(`COC API error (${response.status}): ${errorText}`)
        }
      }

      playerData = await response.json()
    } catch (error) {
      console.error("COC API fetch error:", error)
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch player data. Check your player tag or try again later.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 },
      )
    }

    // Create roast prompt
    let roastPrompt = `You are a savage Clash of Clans roast master. Roast this player's base and stats mercilessly but keep it fun and game-related. Be creative, funny, and brutal but UNFILTERED
    USE THE DATA A LOT

Player Data:
- Name: ${playerData.name}
- Level: ${playerData.expLevel}
- Trophies: ${playerData.trophies}
- War Stars: ${playerData.warStars}
- Town Hall Level: ${playerData.townHallLevel}
- Clan: ${playerData.clan?.name || "No clan (loner!)"}
- Donations Given: ${playerData.donations}
- Donations Received: ${playerData.donationsReceived}
- Attack Wins: ${playerData.attackWins}
- Defense Wins: ${playerData.defenseWins}

Army Composition: ${JSON.stringify(playerData.troops || [])}
Heroes: ${JSON.stringify(playerData.heroes || [])}
`

    if (baseJson) {
      roastPrompt += `\n\nBase Layout JSON (User provided): ${baseJson}`
    }

    roastPrompt += `\n\nMake it a savage but entertaining roast that any COC player would laugh at. Use COC terminology and be creative with the insults. If base JSON is provided, roast both their stats AND their base layout. If no base JSON, focus on their player stats. Keep it SPECIFIC and make it 300 words BRUTAL! 🔥`

    // Generate roast using Gemini
    try {
      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: roastPrompt
      })

      return NextResponse.json({
        roast: text,
        playerData: {
          name: playerData.name,
          tag: playerData.tag,
          expLevel: playerData.expLevel,
          trophies: playerData.trophies,
          warStars: playerData.warStars,
          townHallLevel: playerData.townHallLevel,
        },
        baseJsonProvided: !!baseJson, // Let frontend know if base JSON was provided
      })
    } catch (aiError) {
      console.error("AI Generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate roast. AI service might be temporarily unavailable.",
          details: aiError instanceof Error ? aiError.message : "AI generation failed",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("General API error:", error)
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again!",
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
