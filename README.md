# Should I Delegate This? - AI Decision Game

An interactive educational game designed for school leaders and educators to learn when to delegate tasks to AI versus keeping them human-driven through timed decision-making scenarios.

## 🎮 Game Features

- **6 Educational Scenarios**: Real-world situations covering teacher tasks, student support, leadership decisions, assessments, content creation, and curriculum planning
- **Timed Decision Making**: 45-second countdown per scenario to encourage quick thinking
- **Immediate Feedback**: Instant explanations for correct/incorrect decisions with humorous examples
- **Scoring System**: 100 points per correct decision with final percentage scoring
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lukeyounge/dlg8.git
cd dlg8

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the game in your browser.

## 🛠 Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Vercel**: Deployment platform

## 📁 Project Structure

```
dlg8/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ShouldIDelegateGame.tsx
├── public/               # Static assets
└── README.md
```

## 🎯 Game Mechanics

### Scenarios

Each scenario presents a realistic educational situation where users must decide whether to:
- **DELEGATE to AI**: Tasks that AI can handle effectively
- **Keep HUMAN**: Tasks requiring human judgment, expertise, or personal knowledge

### Feedback System

- ✅ **Correct decisions**: Explanation of why the choice was right
- ❌ **Incorrect decisions**: Guidance on better delegation + humorous "what went wrong" examples

### Key Learning Outcomes

- **Good for AI**: Content generation, variations, drafts, formatting, research
- **Keep Human**: Student assessment, personal decisions, curriculum choices based on context
- **Remember**: AI is a powerful tool, but professional judgment is irreplaceable

## 🚢 Deployment

This project is optimized for Vercel deployment:

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

The app is configured for static export and will automatically deploy when pushed to the main branch.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built for educational workshops and professional development in AI delegation decision-making.