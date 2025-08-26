"use client";

import { useState } from "react";
import {
  Flex,
  Text,
  Container,
  Section,
  Heading,
  Button as RadixButton,
  Card as RadixCard,
} from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ComponentsDemo() {
  const [selectedComponent, setSelectedComponent] = useState<string>("buttons");

  const components = [
    {
      id: "buttons",
      label: "Buttons",
      description: "Various button styles and variants",
    },
    {
      id: "cards",
      label: "Cards",
      description: "Card layouts and compositions",
    },
    {
      id: "forms",
      label: "Form Elements",
      description: "Inputs, selects, and form controls",
    },
    {
      id: "navigation",
      label: "Navigation",
      description: "Menus, dropdowns, and navigation",
    },
  ];

  const renderComponentDemo = () => {
    switch (selectedComponent) {
      case "buttons":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">shadcn/ui Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Radix UI Buttons</h3>
              <Flex gap="3" wrap="wrap">
                <RadixButton size="3" variant="solid">
                  Solid
                </RadixButton>
                <RadixButton size="3" variant="soft">
                  Soft
                </RadixButton>
                <RadixButton size="3" variant="outline">
                  Outline
                </RadixButton>
                <RadixButton size="3" variant="ghost">
                  Ghost
                </RadixButton>
              </Flex>
            </div>
          </div>
        );

      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>shadcn/ui Card</CardTitle>
                <CardDescription>
                  A customizable card component built with Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card uses the shadcn/ui styling system with full
                  customization options.
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <RadixCard size="3">
              <Flex direction="column" gap="3">
                <Heading size="4">Radix UI Card</Heading>
                <Text color="gray" size="2">
                  A card component from Radix UI Themes with consistent design
                  tokens
                </Text>
                <Text size="2">
                  This card follows the Radix design system and integrates
                  seamlessly with other Radix components.
                </Text>
                <Flex align="center" gap="2" mt="2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    RU
                  </div>
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="medium">
                      Radix User
                    </Text>
                    <Text size="1" color="gray">
                      Designer
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </RadixCard>
          </div>
        );

      case "navigation":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Dropdown Menu</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Badges & Status</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Text>Select a component category to see the demo</Text>
          </div>
        );
    }
  };

  return (
    <Container size="4" className="py-8">
      <Section>
        <Flex
          direction="column"
          gap="4"
          align="center"
          className="text-center mb-8"
        >
          <Heading size="8" weight="bold">
            Component Library Demo
          </Heading>
          <Text size="5" color="gray" className="max-w-2xl">
            Interactive examples of Radix UI Themes and shadcn/ui components
            working together
          </Text>
        </Flex>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {components.map((component) => (
                <Button
                  key={component.id}
                  variant={
                    selectedComponent === component.id ? "default" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setSelectedComponent(component.id)}
                >
                  {component.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {components.find((c) => c.id === selectedComponent)?.label}
              </CardTitle>
              <CardDescription>
                {
                  components.find((c) => c.id === selectedComponent)
                    ?.description
                }
              </CardDescription>
            </CardHeader>
            <CardContent>{renderComponentDemo()}</CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Info */}
      <Section>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Benefits</CardTitle>
            <CardDescription>
              Why this technology combination works so well together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">🎨 Design Consistency</h4>
                <p className="text-sm text-muted-foreground">
                  Radix UI Themes provides a coherent design system while
                  shadcn/ui offers customizable components that follow the same
                  design principles.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">🛠️ Developer Experience</h4>
                <p className="text-sm text-muted-foreground">
                  TypeScript support, excellent documentation, and copy-paste
                  component code make development fast and reliable.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">⚡ Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Tree-shakable components, minimal bundle size, and optimized
                  CSS output ensure excellent performance.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">♿ Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  Both component libraries prioritize accessibility with proper
                  ARIA attributes and keyboard navigation support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
