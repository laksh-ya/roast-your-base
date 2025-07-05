import { type NextRequest, NextResponse } from "next/server"
import { ImageResponse } from "next/og"

export async function POST(request: NextRequest) {
  try {
    const { playerData, roast } = await request.json()

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          backgroundImage: "linear-gradient(45deg, #dc2626, #ea580c, #d97706)",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#fbbf24",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              marginRight: "20px",
            }}
          >
            🔥 ROASTED! 🔥
          </div>
        </div>

        {/* Player Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "3px solid #fbbf24",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#fbbf24",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              marginRight: "20px",
            }}
          >
            {playerData.expLevel}
          </div>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>{playerData.name}</div>
            <div style={{ fontSize: "16px", opacity: 0.8 }}>
              🏆 {playerData.trophies} | ⭐ {playerData.warStars} Wars
            </div>
          </div>
        </div>

        {/* Roast Text */}
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "30px",
            borderRadius: "15px",
            border: "2px solid #dc2626",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#fca5a5",
              lineHeight: 1.4,
              marginBottom: "20px",
            }}
          >
            "{roast}"
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#fbbf24",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Get your base roasted at: RoastYourBase.com
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating card:", error)
    return NextResponse.json({ error: "Failed to generate card" }, { status: 500 })
  }
}
