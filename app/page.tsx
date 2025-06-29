"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Zap, Swords, HelpCircle, Github, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function COCRoastPage() {
  const [playerCode, setPlayerCode] = useState("")
  const [baseJson, setBaseJson] = useState("")
  const [roast, setRoast] = useState("")
  const [playerData, setPlayerData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showHoverVideo, setShowHoverVideo] = useState(false)

  const handleRoast = async () => {
    if (!playerCode.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerCode: playerCode.trim(),
          baseJson: baseJson.trim() || null,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setRoast(`❌ Error: ${data.error}${data.details ? `\n\nDetails: ${data.details}` : ""}`)
      } else {
        setPlayerData(data.playerData)
        setRoast(data.roast)
      }
    } catch (error) {
      console.error("Frontend error:", error)
      setRoast(
        `❌ Network Error: ${error instanceof Error ? error.message : "Something went wrong. Please try again!"}`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-yellow-700 to-orange-800 relative overflow-hidden">
      {/* COC-style background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          opacity: 0.1,
          backgroundImage: "radial-gradient(rgba(251,191,36,1) 3px, transparent 3px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        {/* Header with Image */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/roast-your-base-title.png"
              alt="Roast Your Base – Clash of Clans Style"
              className="max-w-full h-auto w-auto max-h-48 sm:max-h-64 md:max-h-80"
            />
          </div>
          <p className="text-lg sm:text-xl text-amber-100 max-w-2xl mx-auto font-bold drop-shadow-lg">
            Get your Clash of Clans base absolutely destroyed by AI! 🔥
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge className="bg-amber-500 text-amber-900 border-amber-600 font-bold shadow-lg">
              ⚡ Powered by Gemini AI
            </Badge>
            <Badge className="bg-green-600 text-green-100 border-green-700 font-bold shadow-lg">
              🛡️ COC API Integrated
            </Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 lg:gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 border-amber-600 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-amber-200 flex items-center gap-2 text-xl sm:text-2xl">
                <Zap className="w-6 h-6 text-yellow-400" />
                Ready to Get Roasted?
              </CardTitle>
              <CardDescription className="text-amber-100/80 text-sm sm:text-base">
                Enter your player tag and optionally your base layout for maximum destruction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <label className="text-sm sm:text-base font-bold text-amber-200 mb-2 block">
                  🏷️ Player Tag (Required)
                </label>
                <Input
                  placeholder="#YOURPLAYERTAGHERE"
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="bg-amber-800/50 border-amber-600 text-amber-100 placeholder-amber-300/60 text-base sm:text-lg font-semibold focus:border-yellow-400 focus:ring-yellow-400/50"
                />
                <p className="text-xs sm:text-sm text-amber-200/70 mt-1">📱 Find this in your Clash of Clans profile</p>
              </div>

              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <label className="text-sm sm:text-base font-bold text-amber-200">📋 Base JSON (Optional)</label>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative"
                      onMouseEnter={() => setShowHoverVideo(true)}
                      onMouseLeave={() => setShowHoverVideo(false)}
                    >
                      <HelpCircle className="w-4 h-4 text-amber-300 cursor-help" />
                      {showHoverVideo && (
                        <div className="absolute bottom-6 left-0 z-50 bg-amber-900 border border-amber-600 rounded-lg p-3 shadow-xl min-w-[200px] sm:min-w-[250px]">
                          <div className="text-xs text-amber-200 mb-2 font-bold">Quick Tutorial:</div>
                          <div className="bg-amber-800/50 rounded p-2 text-xs text-amber-100">
                            🎥 Export your base layout from COC and paste the JSON here for more detailed roasting!
                          </div>
                        </div>
                      )}
                    </div>
                    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setShowTutorial(true)}
                          className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 underline cursor-pointer bg-transparent border-none p-0 font-semibold"
                        >
                          How to get this? 📺
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-amber-900 to-orange-900 border-amber-600 max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-amber-200 flex items-center gap-2 text-xl">
                            <HelpCircle className="w-5 h-5" />
                            How to Get Your Base JSON
                          </DialogTitle>
                          <DialogDescription className="text-amber-100/80">
                            Follow this tutorial to export your base layout from Clash of Clans
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* YouTube Video Embed */}
                          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-amber-600 shadow-lg">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/2pmTf7PWmTE"
                              title="How to Export Your Clash of Clans Base JSON"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>

                          {/* Instructions */}
                          <div className="bg-amber-800/50 rounded-lg p-4 border border-amber-600">
                            <h4 className="text-amber-200 font-bold mb-3 flex items-center gap-2 text-lg">
                              📋 Quick Steps:
                            </h4>
                            <ol className="text-sm text-amber-100 space-y-2 list-decimal list-inside">
                              <li>Open Clash of Clans and go to your base</li>
                              <li>Go to Settings ⚙️</li>
                              <li>Click on More Settings and Scroll to find Export Your Base</li>
                              <li>Copy and paste the JSON into the field above</li>
                            </ol>
                          </div>

                          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                            <p className="text-sm text-blue-200 flex items-center gap-2">
                              💡 <strong>Pro Tip:</strong> This is optional but helps the AI roast your base layout more
                              specifically!
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Textarea
                  placeholder='{"buildings": [...], "walls": [...]} - Paste your base JSON here'
                  value={baseJson}
                  onChange={(e) => setBaseJson(e.target.value)}
                  className="bg-amber-800/50 border-amber-600 text-amber-100 placeholder-amber-300/60 min-h-[80px] sm:min-h-[100px] focus:border-yellow-400 focus:ring-yellow-400/50"
                />
              </div>

              <Button
                onClick={handleRoast}
                disabled={loading || !playerCode.trim()}
                className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg border-2 border-red-500 hover:border-red-400 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Preparing the Roast...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    ROAST MY BASE! 🔥
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-br from-red-900/90 to-orange-900/90 border-red-600 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-red-200 flex items-center gap-2 text-xl sm:text-2xl">
                <Swords className="w-6 h-6 text-orange-400" />
                The Roast Zone
              </CardTitle>
              <CardDescription className="text-red-100/80 text-sm sm:text-base">
                Brace yourself for the ultimate base destruction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {playerData && (
                <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-800/50 to-orange-800/50 rounded-lg border border-yellow-600 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                      <span className="text-sm sm:text-base font-bold text-gray-900">{playerData.expLevel}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-yellow-100 text-base sm:text-lg">{playerData.name}</h3>
                      <p className="text-xs sm:text-sm text-yellow-200/80">{playerData.tag}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="text-yellow-200/90 font-semibold">
                      🏆 Trophies: <span className="text-yellow-300">{playerData.trophies}</span>
                    </div>
                    <div className="text-yellow-200/90 font-semibold">
                      ⭐ War Stars: <span className="text-blue-300">{playerData.warStars}</span>
                    </div>
                  </div>
                </div>
              )}

              {roast ? (
                <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/50 rounded-lg p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">🔥</div>
                    <span className="font-bold text-red-300 text-base sm:text-lg">AI ROAST INCOMING!</span>
                  </div>
                  <div className="text-red-100 whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-medium">
                    {roast}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-red-300/70">
                  <Swords className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-semibold">Enter a player tag above to get started!</p>
                  <p className="text-sm sm:text-base mt-2">Your base is about to get absolutely demolished 💀</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 sm:mt-16 bg-gradient-to-r from-amber-900/80 to-orange-900/80 rounded-xl border border-amber-600 backdrop-blur-sm shadow-2xl">
          <div className="px-6 py-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Project Info */}
              <div className="text-center md:text-left">
                <h3 className="text-amber-200 font-bold text-lg mb-2">🔥 Roast Your Base</h3>
                <p className="text-amber-100/80 text-sm">
                  The ultimate AI-powered Clash of Clans base roasting experience
                </p>
              </div>

              {/* Creators */}
              <div className="text-center">
                <h3 className="text-amber-200 font-bold text-lg mb-3">👨‍💻 Created By</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href="https://github.com/laksh-ya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-800/50 hover:bg-amber-700/50 px-4 py-2 rounded-lg border border-amber-600 transition-all duration-200 text-amber-100 hover:text-amber-50"
                  >
                    <Github className="w-4 h-4" />
                    <span className="font-semibold">Lakshya</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://github.com/harshtripathi272"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-800/50 hover:bg-amber-700/50 px-4 py-2 rounded-lg border border-amber-600 transition-all duration-200 text-amber-100 hover:text-amber-50"
                  >
                    <Github className="w-4 h-4" />
                    <span className="font-semibold">Harsh</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="text-center md:text-right">
                <h3 className="text-amber-200 font-bold text-lg mb-2">{"⚡ Powered By\nGemini"}</h3>
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <Badge className="bg-blue-600 text-blue-100 border-blue-700">COC API</Badge>
                  <Badge className="bg-purple-600 text-purple-100 border-purple-700">Gemini AI</Badge>
                  <Badge className="bg-gray-700 text-gray-100 border-gray-600">Next.js</Badge>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-amber-600/50 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-amber-100/70 text-sm text-center sm:text-left">Made with 💀 for the COC community</p>
              <div className="flex items-center gap-4 text-sm"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
