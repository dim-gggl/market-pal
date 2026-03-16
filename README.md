# market-pal

> Your weekly meals, planned. Your grocery list, done.

A Gemini-powered meal planner that generates a full week of recipes based on your preferences, dietary habits, and local supermarket — along with a ready-to-use shopping list.

## Features

- 🍽️ Personalized weekly meal plan with full recipes
- 🛒 Grocery list tailored to your area and preferred supermarket
- 📍 Location-aware suggestions
- 🔥 Firebase backend (Firestore)
- ⚡ Powered by Gemini API

## Stack

React · TypeScript · Vite · Firebase (Firestore) · Gemini API

## Run locally

**Prerequisites:** Node.js, a Gemini API key, a Firebase project

```bash
npm install
cp .env.local.example .env.local
# Set GEMINI_API_KEY and Firebase config in .env.local
npm run dev
```

> ⚠️ Never commit your API keys. Add `.env.local` to `.gitignore`.

## Live demo

[Open in AI Studio](https://ai.studio/apps/8ff79035-3f3c-451c-88ec-4e7366bf41fb?fullscreenApplet=true)
