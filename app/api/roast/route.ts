// import { type NextRequest, NextResponse } from "next/server"
// import { generateText } from "ai"
// import { google } from "@ai-sdk/google"

// const COC_API_TOKEN = process.env.COC_API_TOKEN || "your-coc-api-token"

// export async function POST(request: NextRequest) {
//   try {
//     const { playerCode, baseJson } = await request.json()

//     if (!playerCode) {
//       return NextResponse.json({ error: "Player code is required" }, { status: 400 })
//     }

//     // Clean the player tag (remove # if present and add it back)
//     const cleanTag = playerCode.replace("#", "")
//     const playerTag = `%23${cleanTag}`

//     // Fetch player data from COC API
//     let playerData
//     try {
//       const response = await fetch(`https://cocproxy.royaleapi.dev/v1/players/${playerTag}`, {
//         headers: {
//           Authorization: `Bearer ${COC_API_TOKEN}`,
//           Accept: "application/json",
//         },
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         console.error("COC API Error:", response.status, errorText)

//         if (response.status === 404) {
//           throw new Error("Player not found. Check your player tag and try again.")
//         } else if (response.status === 403) {
//           throw new Error("API access denied. Please check API configuration.")
//         } else if (response.status === 429) {
//           throw new Error("Too many requests. Please wait a moment and try again.")
//         } else {
//           throw new Error(`COC API error (${response.status}): ${errorText}`)
//         }
//       }

//       playerData = await response.json()
//     } catch (error) {
//       console.error("COC API fetch error:", error)
//       return NextResponse.json(
//         {
//           error:
//             error instanceof Error
//               ? error.message
//               : "Failed to fetch player data. Check your player tag or try again later.",
//           details: error instanceof Error ? error.message : "Unknown error",
//         },
//         { status: 400 },
//       )
//     }

//     console.log("Fetched Player Data:", JSON.stringify(playerData, null, 2))

//     // Extract attack/defense wins from achievements if not in root
//     const getAchievementValue = (achievements: any[], name: string) => {
//       const achievement = achievements?.find(a => a.name === name)
//       return achievement?.value || 0
//     }

//     // Ensure we have all the required data
//     const cleanPlayerData = {
//       name: playerData.name,
//       tag: playerData.tag,
//       expLevel: playerData.expLevel,
//       trophies: playerData.trophies,
//       bestTrophies: playerData.bestTrophies,
//       warStars: playerData.warStars,
//       townHallLevel: playerData.townHallLevel,
//       townHallWeaponLevel: playerData.townHallWeaponLevel,
//       donations: playerData.donations,
//       donationsReceived: playerData.donationsReceived,
//       attackWins: playerData.attackWins || getAchievementValue(playerData.achievements, "Conqueror"),
//       defenseWins: playerData.defenseWins || getAchievementValue(playerData.achievements, "Unbreakable"),
//       clan: playerData.clan,
//       league: playerData.league,
//       troops: playerData.troops,
//       heroes: playerData.heroes,
//       spells: playerData.spells,
//       achievements: playerData.achievements,
//       labels: playerData.labels,
//       builderHall: playerData.builderHall,
//       builderBaseTrophies: playerData.builderBaseTrophies,
//       buildersHall: playerData.buildersHall
//     }

//     console.log("Clean Player Data:", JSON.stringify(cleanPlayerData, null, 2))

//     // Create roast prompt
//     let roastPrompt = `You are a savage Clash of Clans roast master. Roast this player's base and stats mercilessly but keep it fun and game-related. Be creative, funny, and brutal but UNFILTERED.
// USE ALL THE DATA PROVIDED - BE SPECIFIC AND DETAILED IN YOUR ROAST

// Complete Player Data:
// ${JSON.stringify(cleanPlayerData, null, 2)}
// `

//     if (baseJson) {
//       roastPrompt += `\n\nBase Layout JSON (User provided): ${baseJson}`
//     }

//     roastPrompt += `\n\nMake it a savage but entertaining roast that any COC player would laugh at. Use COC terminology and be creative with the insults. If base JSON is provided, roast both their stats AND their base layout. If no base JSON, focus on their player stats. Keep it SPECIFIC and make it 300 words BRUTAL! 🔥`

//     // Generate roast using Gemini
//     try {
//       const { text } = await generateText({
//         model: google("gemini-2.5-flash"),
//         prompt: roastPrompt
//       })

//   console.log("Generated Roast Prompt:", roastPrompt)



//       return NextResponse.json({
//         roast: text,
//         playerData: {
//           name: playerData.name,
//           tag: playerData.tag,
//           expLevel: playerData.expLevel,
//           trophies: playerData.trophies,
//           warStars: playerData.warStars,
//           townHallLevel: playerData.townHallLevel,
//         },
//         baseJsonProvided: !!baseJson, // Let frontend know if base JSON was provided
//       })
//     } catch (aiError) {
//       console.error("AI Generation error:", aiError)
//       return NextResponse.json(
//         {
//           error: "Failed to generate roast. AI service might be temporarily unavailable.",
//           details: aiError instanceof Error ? aiError.message : "AI generation failed",
//         },
//         { status: 500 },
//       )
//     }
//   } catch (error) {
//     console.error("General API error:", error)
//     return NextResponse.json(
//       {
//         error: "Something went wrong. Please try again!",
//         details: error instanceof Error ? error.message : "Unknown server error",
//       },
//       { status: 500 },
//     )
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const COC_API_TOKEN = process.env.COC_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { playerCode, baseJson } = await request.json()

    if (!playerCode) {
      return NextResponse.json({ error: "Player code is required" }, { status: 400 })
    }

    if (!COC_API_TOKEN) {
      return NextResponse.json({ error: "API token not configured" }, { status: 500 })
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

    console.log("Fetched Player Data:", JSON.stringify(playerData, null, 2))

    // Create roast prompt with FULL player data and explicit instructions
    let roastPrompt = `You are a savage Clash of Clans roast master. Roast this player's base and stats mercilessly but keep it fun and game-related. Be creative, funny, and brutal but UNFILTERED.

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. ALL THE DATA BELOW IS REAL AND ACCURATE FROM THE OFFICIAL COC API
2. DO NOT assume or make up values - use ONLY what is provided
3. If a field shows 0, that means they actually have ZERO (not missing data)
4. If a field is missing/undefined, DO NOT mention it
5. BE SPECIFIC - reference actual numbers, levels, and stats from the data
6. Use the player's ACTUAL stats - don't say "probably" or "might have"

COMPLETE PLAYER DATA FROM COC API:
${JSON.stringify(playerData, null, 2)}

KEY STATS TO ROAST (use the ACTUAL values above):
- Town Hall Level: ${playerData.townHallLevel ?? 'Unknown'}
- Trophies: ${playerData.trophies ?? 'Unknown'}
- Best Trophies: ${playerData.bestTrophies ?? 'Unknown'}
- Attack Wins: ${playerData.attackWins ?? 'Unknown'}
- Defense Wins: ${playerData.defenseWins ?? 'Unknown'}
- War Stars: ${playerData.warStars ?? 'Unknown'}
- Donations: ${playerData.donations ?? 'Unknown'}
- Donations Received: ${playerData.donationsReceived ?? 'Unknown'}
- Experience Level: ${playerData.expLevel ?? 'Unknown'}
- Builder Hall Level: ${playerData.builderHallLevel ?? 'Unknown'}
- Versus Trophies: ${playerData.versusTrophies ?? 'Unknown'}
- Clan: ${playerData.clan?.name ?? 'No Clan (Clanless loser)'}
- League: ${playerData.league?.name ?? 'Unranked'}
`

    if (baseJson) {
      roastPrompt += `\n\nBASE LAYOUT JSON:
${baseJson}
`
    }

    roastPrompt += `\n\nROASTING GUIDELINES:
- Roast their ACTUAL stats - don't make up numbers or say "probably 0" 
- If donations are 0, roast them for being a leech
- If trophies are low for their TH level, roast them for trophy dropping
- If attack wins are low, roast them for being scared to attack
- If defense wins are low, roast them for having a trash base
- If they have no clan, roast them for being a lonely loser
- If base JSON is provided, roast their base layout too
- Look at their troop/hero/spell levels in the full data above
- Check their achievements for embarrassing gaps
- Make it SAVAGE, SPECIFIC, and FUNNY - 300-400 words of pure ROASTING! 🔥`

    console.log("Generated Roast Prompt:", roastPrompt)

    // Generate roast using Gemini
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: roastPrompt
      })

      return NextResponse.json({
        roast: text,
        playerData: playerData,
        baseJsonProvided: !!baseJson,
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