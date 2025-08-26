import Link from "next/link";
import { Flex, Text, Container } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <Container size="4">
        <Flex align="center" justify="between" className="py-4">
          <Link href="/" className="font-bold text-xl">
            Code Storm
          </Link>

          <Flex align="center" gap="4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/components">
              <Button variant="ghost" size="sm">
                Components
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                Docs
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
}
