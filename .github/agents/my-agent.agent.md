#!/bin/bash
# Ubuntu Pools DevOps Agent - Quick Setup Script
# This script helps you get started with your custom AI agent

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    UBUNTU POOLS DEVOPS AGENT - QUICK SETUP                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Create agent workspace
mkdir -p ~/ubuntu-pools-agent
cd ~/ubuntu-pools-agent

# Copy system prompt
cat > system-prompt.txt << 'EOF'
You are the Ubuntu Pools DevOps Agent (UPDA), a specialized AI assistant helping with Phase 1 hardening and deployment of the Ubuntu Pools platform.

## Your Role
You are a Senior DevOps Specialist and Security Engineer with expertise in:
- Vercel/Netlify deployment and configuration
- Security headers (CSP, HSTS, CORS)
- Lighthouse optimization and Core Web Vitals
- npm security auditing and vulnerability management
- Git workflows and version control
- Phase-based software delivery

## Your Mission
Guide the user through Phase 1 completion for Ubuntu Pools:
- Fix robots.txt serving (currently serving HTML)
- Address npm vulnerabilities
- Improve Lighthouse scores (Performance 70→75+, Accessibility 79→90+)
- Implement security headers
- Track progress against Phase 1 Completion Gate Checklist

## Current Context
**Project**: Ubuntu Pools - Governed Pilot (No Custody, No Real Funds)
**Platform**: Vercel
**URL**: https://how-i-met-your-mother-psi.vercel.app
**Repository**: github.com/ivemino35-droid/how-i-met-your-mother
**Environment**: Replit workspace

**Current Lighthouse Scores**:
- Performance: 70/100 (Target: 75+)
- Accessibility: 79/100 (Target: 90+)
- Best Practices: 100/100 ✅
- SEO: 92/100 ✅

**Critical Issues**:
1. robots.txt serving HTML instead of plain text (77 errors)
2. 4 high severity npm vulnerabilities
3. Git authentication issues in Replit
4. Missing aria-labels on buttons
5. Non-sequential heading hierarchy

## Response Format
For each request, structure your response as:

1. **🎯 Goal**: What we're trying to achieve
2. **📝 Command**: Exact command(s) to run
3. **💡 Explanation**: Why this matters
4. **✅ Verification**: How to confirm it worked
5. **📊 Progress Update**: What's complete, what's next

## Progress Tracker
**Phase 1 Status**:
- [ ] robots.txt fix deployed
- [ ] npm vulnerabilities resolved
- [ ] Git authentication working
- [ ] Accessibility improvements deployed
- [ ] Performance optimizations applied
- [ ] Phase 1 Completion Gate signed off

Begin by asking: "What Phase 1 task can I help you with?"
EOF

echo "✅ System prompt created: system-prompt.txt"

# Create initial message template
cat > initial-message.txt << 'EOF'
I'm working on Ubuntu Pools Phase 1 hardening. 

Current status:
- Deployment: Live at https://how-i-met-your-mother-psi.vercel.app
- Lighthouse: Performance 70, Accessibility 79, Best Practices 100, SEO 92
- Critical issue: robots.txt serving HTML (77 errors)
- 4 high npm vulnerabilities
- Git authentication issues

What should I do first?
EOF

echo "✅ Initial message created: initial-message.txt"

# Create progress tracker
cat > progress-tracker.md << 'EOF'
# Ubuntu Pools - Phase 1 Progress Tracker

## Session Start
Date: $(date)
Environment: Replit → Vercel

## Checklist

### Critical Issues
- [ ] robots.txt fix deployed and verified
- [ ] npm vulnerabilities resolved (currently 4 high)
- [ ] Git authentication configured

### Accessibility
- [ ] aria-labels added to buttons
- [ ] Heading hierarchy fixed (h1→h2→h3)
- [ ] Color contrast improved (4.5:1 minimum)

### Performance
- [ ] Code splitting implemented
- [ ] Images optimized (WebP conversion)
- [ ] Tailwind CDN removed (use local)

### Documentation
- [ ] Baseline metrics documented
- [ ] Changes logged
- [ ] Phase 1 completion report generated

## Lighthouse Targets
- Performance: 70 → 75+ ⏳
- Accessibility: 79 → 90+ ⏳
- Best Practices: 100 ✅
- SEO: 92 → 95+ ⏳

## Notes
[Add your notes here as you work]

---
Last Updated: $(date)
EOF

echo "✅ Progress tracker created: progress-tracker.md"

# Create command reference
cat > command-reference.md << 'EOF'
# Quick Command Reference

## Deployment
```bash
git add .
git commit -m "message"
git push origin main
```

## Verification
```bash
curl -I https://how-i-met-your-mother-psi.vercel.app
curl https://how-i-met-your-mother-psi.vercel.app/robots.txt
npm audit
npm test
```

## Fixes
```bash
npm audit fix
npm update minimatch glob rimraf gaxios
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Lighthouse
Online: https://pagespeed.web.dev/
Enter: https://how-i-met-your-mother-psi.vercel.app/#/dashboard
EOF

echo "✅ Command reference created: command-reference.md"

# Create README
cat > README.md << 'EOF'
# Ubuntu Pools DevOps Agent

This directory contains everything you need to interact with your custom AI agent.

## Files

- `system-prompt.txt` - Copy this into your AI assistant
- `initial-message.txt` - Your first message to the agent
- `progress-tracker.md` - Track your Phase 1 completion
- `command-reference.md` - Quick command lookup

## How to Use

### Step 1: Choose Your AI Platform

**Claude (Recommended)**:
- Go to: https://claude.ai
- Start new conversation
- Paste content of `system-prompt.txt`
- Then paste content of `initial-message.txt`

**ChatGPT**:
- Go to: https://chat.openai.com
- Use GPT-4 or GPT-4 Turbo
- Paste content of `system-prompt.txt`
- Then paste content of `initial-message.txt`

**Gemini**:
- Go to: https://gemini.google.com
- Paste content of `system-prompt.txt`
- Then paste content of `initial-message.txt`

### Step 2: Work Through Tasks

Agent will guide you step-by-step through:
1. Fixing robots.txt
2. Resolving npm vulnerabilities
3. Configuring Git authentication
4. Improving accessibility
5. Optimizing performance

### Step 3: Track Progress

Update `progress-tracker.md` as you complete tasks.

## Quick Commands

See `command-reference.md` for commonly used commands.

## Need Help?

Ask the agent:
- "What should I do next?"
- "Help me fix [issue]"
- "What's my current status?"
- "Explain [concept]"
EOF

echo "✅ README created: README.md"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SETUP COMPLETE! ✅                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Location: ~/ubuntu-pools-agent"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Read the system prompt:"
echo "   cat ~/ubuntu-pools-agent/system-prompt.txt"
echo ""
echo "2. Copy it to your AI assistant (Claude, ChatGPT, or Gemini)"
echo ""
echo "3. Send your first message:"
echo "   cat ~/ubuntu-pools-agent/initial-message.txt"
echo ""
echo "4. Follow the agent's guidance!"
echo ""
echo "🚀 Let's complete Phase 1!"
echo ""
