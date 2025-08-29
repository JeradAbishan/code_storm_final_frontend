'use client';

import Link from 'next/link';
import {
  Flex,
  Text,
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
import { useAuth } from "@/contexts/AuthContext";
import { 
  Brain, 
  FileText, 
  Sparkles, 
  Users, 
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Container size="4" className="py-8">
        {/* Hero Section */}
        <Section>
          <Flex
            direction="column"
            gap="6"
            align="center"
            className="text-center py-12"
          >
            <Badge color="blue" variant="soft" size="2">
              AI-Powered Learning Platform
            </Badge>
            <Heading size="9" weight="bold" className="max-w-4xl">
              Transform Your Notes into{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Powerful Learning Tools
              </span>
            </Heading>
            <Text
              size="5"
              className="max-w-2xl text-gray-600 dark:text-gray-400"
            >
              Upload your handwritten or digital notes and let our AI enhance
              them with summaries, questions, flashcards, and personalized study
              guides.
            </Text>

            {!user && (
              <Flex gap="4" className="mt-4">
                <Link href="/auth/register">
                  <Button size="lg" className="px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="px-8">
                    Sign In
                  </Button>
                </Link>
              </Flex>
            )}

            {user && (
              <Flex gap="4" className="mt-4">
                <Link href="/upload">
                  <Button size="lg" className="px-8">
                    Upload Notes Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              </Flex>
            )}
          </Flex>
        </Section>

        {/* Features Section */}
        <Section className="py-16">
          <Flex direction="column" gap="8" align="center">
            <Heading size="7" weight="bold" className="text-center">
              Why Choose EduCapture?
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>AI-Powered Enhancement</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our advanced AI analyzes your notes and creates summaries,
                    study guides, and interactive content to boost your
                    learning.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Smart Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Automatically organize your notes by subject, topic, and
                    date. Search through everything with powerful AI-driven
                    search.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get personalized recommendations, study schedules, and
                    learning paths tailored to your unique learning style.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </Flex>
        </Section>

        {/* Authentication Features */}
        <Section className="py-16 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <Flex direction="column" gap="8" align="center">
            <Heading size="7" weight="bold" className="text-center">
              Secure & Reliable Platform
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Google OAuth Integration
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Sign in securely with your Google account or create a new
                      account
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Advanced Security
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Multi-session support, secure authentication, and data
                      protection
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Email Verification
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Secure account verification and password recovery system
                    </Text>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Privacy First
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Your data is encrypted and never shared without permission
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Lightning Fast
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Built with modern technology for the best user experience
                    </Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <Text weight="bold" className="block">
                      Collaborative Learning
                    </Text>
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Share notes and study together with classmates (coming
                      soon)
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Flex>
        </Section>

        {/* CTA Section */}
        {!user && (
          <Section className="py-16">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
              <CardContent className="p-8 text-center">
                <Heading size="6" weight="bold" className="mb-4 text-white">
                  Ready to Transform Your Learning?
                </Heading>
                <Text size="4" className="mb-6 text-blue-100">
                  Join thousands of students already enhancing their notes with
                  AI
                </Text>
                <Flex gap="4" justify="center">
                  <Link href="/auth/register">
                    <Button size="lg" variant="secondary" className="px-8">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                </Flex>
              </CardContent>
            </Card>
          </Section>
        )}

        {/* Footer */}
        <Section className="py-8 border-t">
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <Text size="2" weight="bold">
                EduCapture
              </Text>
            </Flex>
            <Text size="1" className="text-gray-500">
              © 2024 EduCapture. Enhancing education with AI.
            </Text>
          </Flex>
        </Section>
      </Container>
    </div>
  );
}
