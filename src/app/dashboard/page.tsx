/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QuickStartGuide } from "@/components/ui/quick-start-guide";
import { studyHelperService } from "@/lib/study-helper";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Settings,
  FileText,
  Upload,
  Brain,
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react";

function DashboardContent() {
  const { user, logout } = useAuth();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    thisWeekSessions: 0,
  });

  useEffect(() => {
    // Check if user is new (less than 7 days old or no sessions)
    if (user) {
      const userAge = Date.now() - new Date(user.created_at).getTime();
      const isNewUser = userAge < 7 * 24 * 60 * 60 * 1000; // 7 days

      // Load user sessions to check if they have any
      studyHelperService
        .listStudySessions(1)
        .then((response) => {
          const hasNoSessions = response.sessions.length === 0;
          setShowQuickStart(isNewUser || hasNoSessions);

          // Load more detailed stats
          return studyHelperService.listStudySessions(100);
        })
        .then((response) => {
          const sessions = response.sessions;
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          setDashboardStats({
            totalSessions: sessions.length,
            completedSessions: sessions.filter((s) => s.status === "completed")
              .length,
            thisWeekSessions: sessions.filter(
              (s) => new Date(s.created_at) > weekAgo
            ).length,
          });
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending_email_verification":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to enhance your learning today?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={logout} size="sm">
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Start Guide - Show for new users */}
          {showQuickStart && (
            <div className="lg:col-span-3 mb-6">
              <QuickStartGuide onDismiss={() => setShowQuickStart(false)} />
            </div>
          )}

          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-semibold">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </div>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Email{" "}
                    {user.is_email_verified
                      ? "verified"
                      : "pending verification"}
                  </span>
                  <Badge
                    className={
                      user.is_email_verified
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {user.is_email_verified ? "Verified" : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Born {formatDate(user.date_of_birth)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Account status</span>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status.replace("_", " ")}
                  </Badge>
                </div>

                {user.last_login_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last login: {formatDate(user.last_login_at)}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with EduCapture&apos;s powerful features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-20 flex-col gap-2"
                  variant="outline"
                  onClick={() => (window.location.href = "/upload")}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload Notes</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2"
                  variant="outline"
                  onClick={() => (window.location.href = "/upload")}
                >
                  <Brain className="h-6 w-6" />
                  <span>AI Enhancement</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2"
                  variant="outline"
                  onClick={() => (window.location.href = "/upload")}
                >
                  <FileText className="h-6 w-6" />
                  <span>View Uploads</span>
                </Button>

                <Button className="h-20 flex-col gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
              <CardDescription>
                Track your learning progress and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.login_count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Logins
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dashboardStats.completedSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Notes Enhanced
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {dashboardStats.thisWeekSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>

                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Member Since
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {dashboardStats.totalSessions > 0 ? (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest study sessions and AI enhancements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Study sessions created</p>
                        <p className="text-sm text-muted-foreground">
                          {dashboardStats.totalSessions} total sessions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/upload")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">AI enhancements completed</p>
                        <p className="text-sm text-muted-foreground">
                          {dashboardStats.completedSessions} successfully
                          processed
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {dashboardStats.totalSessions > 0
                        ? Math.round(
                            (dashboardStats.completedSessions /
                              dashboardStats.totalSessions) *
                              100
                          )
                        : 0}
                      % success
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">This week&apos;s progress</p>
                        <p className="text-sm text-muted-foreground">
                          {dashboardStats.thisWeekSessions} new sessions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/upload")}
                    >
                      Upload More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-3">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Upload your first study material to begin enhancing your
                  learning with AI.
                </p>
                <Button
                  onClick={() => (window.location.href = "/upload")}
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your First Notes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} requireVerification={true}>
      <DashboardContent />
    </AuthGuard>
  );
}
