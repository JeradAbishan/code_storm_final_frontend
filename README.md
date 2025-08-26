# Code Storm Final - Frontend

A modern Next.js frontend application built with the latest technologies and best practices.

## 🚀 Tech Stack

- **[Next.js 15.5.0](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[Tailwind CSS v4.1](https://tailwindcss.com/)** - Utility-first CSS framework with new architecture
- **[Radix UI Themes](https://www.radix-ui.com/themes)** - Pre-styled component library with design system
- **[shadcn/ui](https://ui.shadcn.com/)** - Customizable components built on Radix primitives
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and enhanced developer experience
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## ✨ Features

- 🎨 **Modern Design System** - Combination of Radix UI Themes and shadcn/ui
- 🌙 **Dark Mode Support** - Built-in dark mode with consistent theming
- 📱 **Responsive Design** - Mobile-first approach with Tailwind utilities
- ♿ **Accessibility** - WCAG compliant components with proper ARIA attributes
- ⚡ **Performance** - Optimized builds with Turbopack and automatic code splitting
- 🛠️ **Developer Experience** - TypeScript, ESLint, and excellent tooling
- 🎯 **Type Safety** - Full TypeScript support across all components

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18 or later
- pnpm (recommended package manager)

### Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # Components demo page
│   ├── docs/              # Documentation page
│   ├── globals.css        # Global styles with Tailwind & Radix
│   ├── layout.tsx         # Root layout with Theme provider
│   └── page.tsx           # Home page
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   └── navigation.tsx    # Navigation component
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Design System Integration

### Component Philosophy

1. **Radix UI Themes** - For layout, typography, and consistent design tokens
2. **shadcn/ui** - For interactive components with full customization
3. **Tailwind CSS** - For utility-first styling and responsive design
4. **CSS Custom Properties** - For consistent theming across systems

### Usage Examples

#### Radix UI Themes Components

```tsx
import { Flex, Text, Button, Container } from "@radix-ui/themes";

function MyComponent() {
  return (
    <Container size="4">
      <Flex direction="column" gap="4">
        <Text size="5" weight="bold">
          Hello World
        </Text>
        <Button size="3" variant="solid">
          Click me
        </Button>
      </Flex>
    </Container>
  );
}
```

#### shadcn/ui Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Action</Button>
      </CardContent>
    </Card>
  );
}
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Component Management
pnpm dlx shadcn@latest add [component]  # Add shadcn/ui components
```

## 📦 Adding Components

### shadcn/ui Components

```bash
# Add individual components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input

# Add multiple components
pnpm dlx shadcn@latest add button card input textarea
```

### Radix UI Components

Radix UI Themes components are available after installation:

```tsx
import { Button, Card, Flex, Text, Container, Section } from "@radix-ui/themes";
```

## 🎨 Customization

### Theming Configuration

1. **Radix UI Theme** in `layout.tsx`:

   ```tsx
   <Theme
     accentColor="blue"
     grayColor="slate"
     radius="large"
     scaling="100%"
   >
   ```

2. **CSS Custom Properties** in `globals.css` for consistent theming
3. **shadcn/ui Configuration** in `components.json`

## 📚 Documentation Pages

Visit these pages in your running application:

- **Home** (`/`) - Technology overview and feature showcase
- **Components** (`/components`) - Interactive component demos
- **Docs** (`/docs`) - Comprehensive documentation

## 🚦 Integration Benefits

- **Design Consistency** - Unified design system across components
- **Developer Experience** - TypeScript support and excellent tooling
- **Performance** - Tree-shakable components and optimized builds
- **Accessibility** - WCAG compliant with proper ARIA attributes
- **Customization** - Full control over component code and styling

Built with ❤️ using Next.js 15.5.0, Tailwind CSS v4.1, Radix UI Themes, and shadcn/ui.

---

## 🚀 Quick Start Guide

1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev`
3. Open browser: `http://localhost:3000`
4. Start building amazing UIs! 🎉
