import {
  Flex,
  Text,
  Button as RadixButton,
  Container,
  Section,
  Heading,
  Badge,
} from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <Container size="4" className="py-8">
      {/* Header Section */}
      <Section>
        <Flex direction="column" gap="4" align="center" className="text-center">
          <Badge color="blue" variant="soft" size="2">
            Tech Stack Demo
          </Badge>
          <Heading size="8" weight="bold">
            Code Storm Final Frontend
          </Heading>
          <Text size="5" color="gray" className="max-w-2xl">
            Built with Next.js 15.5.0, Tailwind CSS v4.1, Radix UI Themes, and
            shadcn/ui components
          </Text>
        </Flex>
      </Section>

      {/* Feature Cards Section */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Next.js Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Next.js 15.5.0
              </CardTitle>
              <CardDescription>
                React framework with App Router and Turbopack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• App Router architecture</li>
                <li>• Server & Client Components</li>
                <li>• TypeScript support</li>
                <li>• Turbopack bundler</li>
              </ul>
            </CardContent>
          </Card>

          {/* Tailwind CSS Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Tailwind CSS v4.1
              </CardTitle>
              <CardDescription>
                Utility-first CSS framework with PostCSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Utility-first approach</li>
                <li>• Dark mode support</li>
                <li>• Custom CSS variables</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>

          {/* Radix UI Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Radix UI Themes
              </CardTitle>
              <CardDescription>
                Pre-styled component library with design system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Accessible components</li>
                <li>• Consistent theming</li>
                <li>• Layout primitives</li>
                <li>• Color system</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Component Demo Section */}
      <Section>
        <Heading size="6" mb="4">
          Component Integration Demo
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radix UI Components */}
          <Card>
            <CardHeader>
              <CardTitle>Radix UI Themes Components</CardTitle>
              <CardDescription>
                Pre-styled components with consistent design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Flex direction="column" gap="3">
                <RadixButton size="3" variant="solid">
                  Radix Primary Button
                </RadixButton>
                <RadixButton size="3" variant="outline" color="gray">
                  Radix Outline Button
                </RadixButton>
                <RadixButton size="3" variant="soft" color="green">
                  Radix Soft Button
                </RadixButton>
              </Flex>

              <Flex gap="2" wrap="wrap">
                <Badge color="blue">Blue Badge</Badge>
                <Badge color="green">Success</Badge>
                <Badge color="orange">Warning</Badge>
                <Badge color="red">Error</Badge>
              </Flex>
            </CardContent>
          </Card>

          {/* shadcn/ui Components */}
          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui Components</CardTitle>
              <CardDescription>
                Customizable components built on Radix primitives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button className="w-full">shadcn/ui Default Button</Button>
                <Button variant="outline" className="w-full">
                  shadcn/ui Outline Button
                </Button>
                <Button variant="secondary" className="w-full">
                  shadcn/ui Secondary Button
                </Button>
              </div>

              <div className="space-y-3">
                <Input placeholder="Enter your email..." />
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Features Grid */}
      <Section>
        <Heading size="6" mb="4">
          Key Features
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Flex
            p="4"
            className="border rounded-lg bg-card"
            direction="column"
            gap="2"
          >
            <Text weight="medium">🎯 Type Safety</Text>
            <Text size="2" color="gray">
              Full TypeScript support across all components and utilities
            </Text>
          </Flex>

          <Flex
            p="4"
            className="border rounded-lg bg-card"
            direction="column"
            gap="2"
          >
            <Text weight="medium">🌙 Dark Mode</Text>
            <Text size="2" color="gray">
              Automatic dark mode support with consistent theming
            </Text>
          </Flex>

          <Flex
            p="4"
            className="border rounded-lg bg-card"
            direction="column"
            gap="2"
          >
            <Text weight="medium">📱 Responsive</Text>
            <Text size="2" color="gray">
              Mobile-first responsive design with Tailwind utilities
            </Text>
          </Flex>

          <Flex
            p="4"
            className="border rounded-lg bg-card"
            direction="column"
            gap="2"
          >
            <Text weight="medium">♿ Accessible</Text>
            <Text size="2" color="gray">
              WCAG compliant components with proper ARIA attributes
            </Text>
          </Flex>
        </div>
      </Section>

      {/* Footer */}
      <Section>
        <Flex justify="center" className="border-t pt-8 mt-8">
          <Text size="2" color="gray">
            Built with ❤️ using the modern React ecosystem
          </Text>
        </Flex>
      </Section>
    </Container>
  );
}
