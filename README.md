# Ally - AI-Powered Medical Assistant

> React + TypeScript SaaS platform for automated medical documentation with AI-driven anamnesis generation and clinical insights

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

---

## Overview

Ally is a healthcare SaaS application designed to automate clinical documentation through AI-assisted transcription and structured medical record generation. The platform captures physician-patient consultations, processes audio/text input, and outputs structured anamnesis in SOAP format with clinical decision support.

**Core Problem**: Physicians spend 2+ hours daily on documentation (Mayo Clinic data), contributing to burnout and reduced patient engagement.

**Solution**: AI assistant that listens to consultations, generates structured medical records, and provides evidence-based clinical insights.

---

## Tech Stack

### Frontend
- **React 18.3** - Component-based UI library
- **TypeScript 5.5** - Static typing and enhanced DX
- **Vite 5.4** - Fast build tool with HMR
- **React Router DOM 6** - Client-side routing
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Tanstack Query 5** - Async state management and data fetching

### Backend & Infrastructure
- **Supabase** - PostgreSQL database, authentication, and storage
  - Row Level Security (RLS) for data isolation
  - Real-time subscriptions
  - OAuth + MFA authentication

### AI Integration

**Note**: The specific AI provider/model is not evident from the codebase. Based on the project requirements (audio transcription → structured anamnesis), the AI pipeline likely includes:

1. **Speech-to-Text**: Audio transcription (provider TBD)
2. **NLP Processing**: Medical entity extraction and structuring
3. **Clinical Reasoning**: SOAP format generation + differential diagnosis suggestions

Integration points to verify in source:
- Check `/src/services/` for AI API calls
- Review environment variables for AI provider keys
- Inspect `/src/lib/` for prompt engineering utilities

### Audio Processing
- **RecordRTC 5.6** - WebRTC-based audio recording
  - Real-time consultation capture
  - Multiple codec support
  - Browser compatibility layer

### Document Generation
- **jsPDF 2.5** - PDF generation for medical records
- **html2canvas 1.4** - HTML to canvas rendering
- **React Markdown 10** - Markdown rendering for clinical notes

### UI/UX
- **Lucide React** - Icon library (462+ icons)
- **Recharts 2** - Data visualization for medical metrics
- **React Hook Form 7** - Form state management
- **Zod 3** - Runtime schema validation
- **Embla Carousel** - Touch-friendly carousel component
- **Sonner** - Toast notifications

### Analytics
- **Amplitude** - Product analytics and user behavior tracking

### Development
- **ESLint 9** - Code linting with TypeScript support
- **PostCSS + Autoprefixer** - CSS processing
- **Lovable Tagger** - Development tooling

---

## Project Structure
ally-prontuario-inteligente/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── services/        # API integration layer
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Root component
├── supabase/            # Database migrations & config
├── public/              # Static assets
└── vite.config.ts       # Vite configuration

---

## Getting Started

### Prerequisites

- Node.js 18+
- Package manager: npm, yarn, or bun
- Supabase account (for backend)

### Installation

```bash
# Clone repository
git clone https://github.com/kyronsatt/ally-prontuario-inteligente.git
cd ally-prontuario-inteligente

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

### Environment Configuration

Create `.env` file in root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AMPLITUDE_API_KEY=your_amplitude_api_key

# AI Provider Configuration (verify in source code)
# VITE_OPENAI_API_KEY=
# VITE_ANTHROPIC_API_KEY=
# VITE_ASSEMBLY_AI_KEY=
```

### Development

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Architecture & Data Flow

### 1. Audio Capture
```typescript
// RecordRTC integration
const recorder = new RecordRTC(stream, {
  type: 'audio',
  mimeType: 'audio/webm',
  // Configuration TBD - check /src/services/
});
```

### 2. AI Processing Pipeline

**Hypothetical flow** (verify in `/src/services/`):
Audio Recording
↓
Speech-to-Text API (provider TBD)
↓
Raw Transcript
↓
NLP Processing (medical entity extraction)
↓
LLM Structuring (SOAP format)
↓
Clinical Insights Generation
↓
Supabase Storage

### 3. Data Storage

Supabase schema (verify in `/supabase/migrations/`):

```sql
-- Example schema (actual structure may differ)
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES auth.users(id),
  audio_url TEXT,
  transcript TEXT,
  anamnesis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Key Features

### Audio Recording
- Browser-based audio capture via WebRTC
- Real-time recording status
- Multi-format export support

### AI-Driven Documentation
- Automated transcription (provider TBD)
- SOAP format structuring:
  - **S**ubjective: Patient complaints
  - **O**bjective: Clinical findings
  - **A**ssessment: Diagnosis
  - **P**lan: Treatment recommendations

### Clinical Decision Support
- Drug interaction alerts
- Differential diagnosis suggestions
- Evidence-based recommendations

### Document Management
- PDF export with jsPDF
- Shareable medical records
- Print-optimized layouts

---

## Component Architecture

### shadcn/ui Integration

The project uses shadcn/ui components built on Radix primitives:

```typescript
// Example component usage
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form"
```

Component configuration in `components.json`:
- Uses Radix UI primitives
- TailwindCSS for styling
- TypeScript definitions included

---

## Data Privacy & Security

- **Row Level Security (RLS)**: Supabase policies enforce data isolation per physician
- **Authentication**: Supabase Auth with OAuth providers + MFA support
- **LGPD Compliance**: Brazilian data protection law considerations
- **HIPAA Readiness**: Architecture supports healthcare compliance requirements

---

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start Vite dev server with HMR |
| `build` | Production build with optimizations |
| `build:dev` | Development build for testing |
| `preview` | Preview production build locally |
| `lint` | Run ESLint on TypeScript/React files |

---

## Development Notes

### AI Integration Points to Investigate

1. **API Service Layer**: Check `/src/services/` for AI provider integrations
2. **Prompt Engineering**: Look for prompt templates in `/src/lib/` or `/src/prompts/`
3. **Model Configuration**: Search for model selection logic (GPT-4, Claude, etc.)
4. **Error Handling**: Verify fallback strategies for AI failures

### Database Migrations

Supabase migrations are in `/supabase/migrations/`. Run migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Type Safety

The project uses TypeScript with strict mode. Key type definitions should be in:
- `/src/types/` - Domain models
- `/src/lib/` - Utility types
- Component props - Inline or via `*.types.ts` files

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Code Style

- Follow existing ESLint configuration
- Use TypeScript for all new code
- Prefer functional components with hooks
- Document complex AI integration logic

---

## Roadmap

### Current (MVP)
- ✅ Audio recording and transcription
- ✅ SOAP format anamnesis generation
- ✅ Basic dashboard
- ✅ PDF export

### Next
- [ ] Multi-modal AI integration (investigate GPT-4o, Claude 3.5)
- [ ] Medical image recognition
- [ ] EHR/EMR system integration
- [ ] Mobile app (React Native consideration)

### Future
- [ ] Telemedicine features
- [ ] Multi-specialty marketplace
- [ ] Hospital/clinic API
- [ ] Healthcare regulatory certifications

---

## License

Proprietary - **Kyronsatt Desenvolvimento de Software LTDA**

Contact for commercial licensing.

---

## Author

**Rafael Kyron**  
Software Engineer

- GitHub: [@kyronsatt](https://github.com/kyronsatt)
- LinkedIn: [kyronsatt](https://linkedin.com/in/kyronsatt)

