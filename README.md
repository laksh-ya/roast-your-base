# Roast Your Base - Project Documentation

## Overview

*Roast Your Base* is an AI-powered web application that roasts Clash of Clans players' bases using their player data and optional base layout JSON. The app combines the Clash of Clans API with Google's Gemini AI to deliver savage, entertaining roasts tailored to each player's stats and base design.

*Live Demo:* [Live](https://roastyourcocbase.vercel.app/) *GitHub:* [Harsh Tripathi](https://github.com/harshtripathi272)   [Lakshya Rathi](https://github.com/laksh-ya)

---

## Core Features

### 1. *Player Data Integration*

- Fetches comprehensive player statistics using player tags
- Displays key metrics: trophies, war stars, town hall level, clan info
- Real-time data validation and error handling


### 2. *AI-Powered Roasting Engine*

- Custom system prompts for Clash of Clans context
- Incorporates player stats and base layout for personalized roasts
- Generates 300-word brutal but entertaining content


### 3. *Base Layout Analysis(Optional)*

- Accepts JSON base layout data from COC's export feature
- Analyzes building placement and defensive strategies
- Provides layout-specific roasting content


### 4. *Social Sharing System*

- Multi-platform sharing (Twitter, WhatsApp, Discord, Instagram)
- Native device share menu integration
- Clipboard functionality for easy sharing


---

##  Technical Architecture

### Backend Implementation

#### *API Proxy Solution - Royal API*

The most critical technical decision was avoiding Supercell's official COC API limitations:

```typescript
// Instead of direct Supercell API (requires static IP whitelisting)
const response = await fetch(`https://api.clashofclans.com/v1/players/${playerTag}`)

// Used Royal API proxy (no IP restrictions)
const response = await fetch(`https://cocproxy.royaleapi.dev/v1/players/${playerTag}`, {
  headers: {
    Authorization: `Bearer ${COC_API_TOKEN}`,
    Accept: "application/json",
  },
})
```


*Why Royal API Proxy?*

- No static IP whitelisting required
- Same data structure as official API
- Better for serverless deployments (Vercel, Netlify)
- Handles rate limiting automatically


#### *Player Tag Processing*

```typescript
// Clean and encode player tags properly
const cleanTag = playerCode.replace("#", "")
const playerTag = `%23${cleanTag}` // URL encode the # symbol
```

#### *Gemini AI Integration*

The roasting engine uses carefully crafted system prompts:

```typescript
const roastPrompt = `You are a savage Clash of Clans roast master. 
Roast this player's base and stats mercilessly but keep it fun and game-related.

Player Data:
- Name: ${playerData.name}
- Level: ${playerData.expLevel}
- Trophies: ${playerData.trophies}
- War Stars: ${playerData.warStars}
- Town Hall Level: ${playerData.townHallLevel}
- Army Composition: ${JSON.stringify(playerData.troops)}

${baseJson ? `Base Layout JSON: ${baseJson}` : ''}

Make it SPECIFIC, use COC terminology, 300 words BRUTAL! 🔥`

const { text } = await generateText({
  model: google("gemini-2.0-flash"),
  prompt: roastPrompt
})
```

#### *Error Handling Strategy*

```typescript
// Comprehensive error handling for different API failures
if (response.status === 404) {
  throw new Error("Player not found. Check your player tag and try again.")
} else if (response.status === 403) {
  throw new Error("API access denied. Please check API configuration.")
} else if (response.status === 429) {
  throw new Error("Too many requests. Please wait a moment and try again.")
}
```

---

## The COC JSON Discovery

### *How It Started*

The project originated from curiosity about a hidden feature in Clash of Clans:

1. *Discovery:* Found "Export Base" option in COC settings
2. *Investigation:* Realized it exports detailed JSON structure
3. *Opportunity:* Could use this data for AI analysis


### *Base JSON Structure*

json
{
  "buildings": [
    {
      "id": "townhall",
      "x": 20,
      "y": 20,
      "level": 14
    }
  ],
  "walls": [
    {
      "x": 15,
      "y": 15,
      "level": 14
    }
  ],
  "traps": [...],
  "decorations": [...]
}


### *AI Analysis Integration*

The AI analyzes:

- Building placement efficiency
- Defensive coverage gaps
- Wall configuration weaknesses
- Overall base design flaws


---

## Technical Learning Journey

### *API Integration Mastery*

- *Challenge:* Supercell API requires static IP whitelisting
- *Solution:* Discovered Royal API proxy service
- *Learning:* Importance of API gateway solutions for serverless apps


### *AI Prompting Techniques*

- *System Prompts:* Crafted personality for the AI roaster
- *Context Injection:* Fed player data and base layouts effectively
- *Output Control:* Managed response length and tone


### *Data Processing*

- *Player Tags:* URL encoding and validation
- *JSON Parsing:* Handling optional base layout data
- *Error Recovery:* Graceful degradation when data is missing


---

## Community Impact

### *Reddit Success Story*

[Space for Reddit testimonials and screenshots]

*r/ClashOfClans Reception:*

- 📈 *35 Upvotes* in 24 hours
- 👀 *11,000+ Views*
- 💬 Positive community feedback
- 🔥 Players sharing their roasts


*Sample Community Reactions:*

plaintext
[Leave space for actual Reddit comments/screenshots]


---

## Frontend Highlights

### *Design Philosophy*

- COC-themed color scheme (orange, amber, red gradients)
- Mobile-first responsive design
- Clash of Clans visual elements and iconography


### *User Experience*

- Progressive disclosure (optional base JSON)
- Loading states and error feedback
- Social sharing integration
- Tutorial modal for base export


---

## Deployment & DevOps

### *Platform:*Vercel

- Serverless functions for API routes
- Automatic deployments from Git
- Environment variable management


### *Environment Variables*

shellscript
COC_API_TOKEN=your_royal_api_token
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key


---

## Future Enhancements

### *Planned Features*

- Clan-wide roasting capabilities
- Base comparison roasts
- Historical player data analysis
- Custom roast templates
- Image generation for roast cards


### *Technical Improvements*

- Caching layer for player data
- Rate limiting implementation
- Analytics integration
- Performance optimizations


---

## Key Takeaways

### *Technical Skills Developed*

1. *API Integration:* Working with gaming APIs and proxy services
2. *AI Prompting:* Crafting effective system prompts for specific use cases
3. *Data Processing:* Handling complex JSON structures and validation
4. *Error Handling:* Building resilient API interactions
5. *Social Integration:* Implementing cross-platform sharing


### *Project Management*

- Rapid prototyping and iteration
- Community-driven feature development
- User feedback integration


---

## Screenshots & Demos

[Space for application screenshots showing:]

- Main interface
- Player data display
- Roast results
- Sharing options
- Tutorial modal
- Mobile responsive design


---

## Contributing

The project is open source and welcomes contributions:

- Bug reports and feature requests
- Code improvements and optimizations
- Documentation enhancements
- Community feedback and testing


---

*Built with curiosity, powered by AI, and fueled by the Clash of Clans community! 🔥*
