import {
  Container,
  Section,
  Heading,
  Text,
  Card as RadixCard,
  Flex,
  Code,
} from "@radix-ui/themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DocsPage() {
  return (
    <Container size="4" className="py-8">
      <Section>
        <Flex
          direction="column"
          gap="4"
          align="center"
          className="text-center mb-8"
        >
          <Badge className="mb-2">Documentation</Badge>
          <Heading size="8" weight="bold">
            Tech Stack Documentation
          </Heading>
          <Text size="5" color="gray" className="max-w-2xl">
            Complete guide to the technologies used in this project
          </Text>
        </Flex>
      </Section>

      <div className="space-y-8">
        {/* Next.js Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Next.js 15.5.0
            </CardTitle>
            <CardDescription>
              React framework with App Router, Server Components, and Turbopack
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• App Router for file-based routing</li>
                <li>• Server and Client Components for optimal performance</li>
                <li>• Built-in TypeScript support</li>
                <li>• Turbopack for fast development builds</li>
                <li>• Automatic code splitting and optimization</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Installation Command</h4>
              <div className="bg-muted p-3 rounded-md">
                <Code size="2">
                  pnpm create next-app@latest . --typescript --eslint --tailwind
                  --app --turbopack
                </Code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tailwind CSS Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Tailwind CSS v4.1
            </CardTitle>
            <CardDescription>
              Utility-first CSS framework with new architecture and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What&apos;s New in v4</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• New CSS engine built in Rust for better performance</li>
                <li>• Native CSS custom properties support</li>
                <li>• Improved dark mode handling</li>
                <li>• Better IntelliSense and autocomplete</li>
                <li>• Simplified configuration with PostCSS plugin</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Configuration</h4>
              <div className="bg-muted p-3 rounded-md">
                <Code size="2">
                  {/* postcss.config.mjs */}
                  const config = &#123;
                  {"\n  "}plugins: [&quot;@tailwindcss/postcss&quot;],
                  {"\n}"};
                </Code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radix UI Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Radix UI Themes
            </CardTitle>
            <CardDescription>
              Pre-styled component library with comprehensive design system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Core Benefits</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Accessible components out of the box</li>
                <li>• Consistent design tokens and theming</li>
                <li>• Layout primitives (Container, Section, Flex, etc.)</li>
                <li>• Comprehensive color system</li>
                <li>• Dark mode support built-in</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Setup</h4>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <Code size="2">pnpm install @radix-ui/themes</Code>
                <br />
                <Code size="2">
                  {/* Add to globals.css */}
                  @import &quot;@radix-ui/themes/styles.css&quot;;
                </Code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* shadcn/ui Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎭 shadcn/ui
            </CardTitle>
            <CardDescription>
              Customizable components built on Radix UI primitives with Tailwind
              CSS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Philosophy</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Copy and paste components, not npm packages</li>
                <li>• Full control over component code</li>
                <li>• Built on Radix UI primitives for accessibility</li>
                <li>• Styled with Tailwind CSS for customization</li>
                <li>• TypeScript by default</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Getting Started</h4>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <Code size="2">pnpm dlx shadcn@latest init</Code>
                <br />
                <Code size="2">
                  pnpm dlx shadcn@latest add button card input
                </Code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Section */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Integration Strategy</CardTitle>
            <CardDescription>
              How all these technologies work together seamlessly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Design System Hierarchy</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>1. Radix UI Themes for layout and typography</li>
                  <li>2. shadcn/ui for interactive components</li>
                  <li>3. Tailwind CSS for custom styling</li>
                  <li>4. CSS variables for consistent theming</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Development Workflow</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>1. Use Radix components for layout structure</li>
                  <li>2. Add shadcn/ui components for interactions</li>
                  <li>3. Customize with Tailwind utilities</li>
                  <li>4. Extend with custom CSS when needed</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RadixCard size="2">
                  <Flex direction="column" gap="2">
                    <Text weight="medium" size="2">
                      Component Selection
                    </Text>
                    <Text size="1" color="gray">
                      Use Radix UI Themes for consistent design elements,
                      shadcn/ui for complex interactions
                    </Text>
                  </Flex>
                </RadixCard>

                <RadixCard size="2">
                  <Flex direction="column" gap="2">
                    <Text weight="medium" size="2">
                      Theming
                    </Text>
                    <Text size="1" color="gray">
                      Leverage CSS custom properties for consistent theming
                      across both component systems
                    </Text>
                  </Flex>
                </RadixCard>

                <RadixCard size="2">
                  <Flex direction="column" gap="2">
                    <Text weight="medium" size="2">
                      Customization
                    </Text>
                    <Text size="1" color="gray">
                      Modify shadcn/ui component source code for
                      project-specific requirements
                    </Text>
                  </Flex>
                </RadixCard>

                <RadixCard size="2">
                  <Flex direction="column" gap="2">
                    <Text weight="medium" size="2">
                      Performance
                    </Text>
                    <Text size="1" color="gray">
                      Tree-shake unused components and optimize CSS output for
                      production builds
                    </Text>
                  </Flex>
                </RadixCard>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package.json Preview */}
        <Card>
          <CardHeader>
            <CardTitle>📦 Dependencies Overview</CardTitle>
            <CardDescription>
              Key packages and their versions in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <Code size="2">
                {`{
  "dependencies": {
    "next": "15.5.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@radix-ui/themes": "^3.2.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4.1.12",
    "eslint": "^9",
    "eslint-config-next": "15.5.0"
  }
}`}
              </Code>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
