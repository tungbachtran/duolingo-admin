// src/pages/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useCourses } from '../hooks/useCourses';
import { useUnits } from '../hooks/useUnits';
import { useLessons } from '../hooks/useLessons';
import { useQuestions } from '../hooks/useQuestions';
import { useTheories } from '../hooks/useTheories';
import { BookOpen, Layers, FileText, HelpCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export const Dashboard = () => {
  const { data: coursesData, isLoading: coursesLoading } = useCourses({ page: 1, pageSize: 1 });
  const { data: unitsData, isLoading: unitsLoading } = useUnits('');
  const { data: lessonsData, isLoading: lessonsLoading } = useLessons('');
  const { data: questionsData, isLoading: questionsLoading } = useQuestions('');
  const { data: theoriesData, isLoading: theoriesLoading } = useTheories('');

  const stats = [
    {
      title: 'Total Courses',
      value: coursesData?.pagination?.totalRecords ?? 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      loading: coursesLoading,
      link: '/courses',
      description: 'Active courses',
    },
    {
      title: 'Total Units',
      value: unitsData?.pagination?.totalRecords ?? 0,
      icon: Layers,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      loading: unitsLoading,
      link: '/units',
      description: 'Learning units',
    },
    {
      title: 'Total Lessons',
      value: lessonsData?.pagination?.totalRecords ?? 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      loading: lessonsLoading,
      link: '/lessons',
      description: 'Available lessons',
    },
    {
      title: 'Total Questions',
      value: questionsData?.pagination?.totalRecords ?? 0,
      icon: HelpCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      loading: questionsLoading,
      link: '/questions',
      description: 'Practice questions',
    },
    {
      title: 'Total Theories',
      value: theoriesData?.pagination?.totalRecords ?? 0,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      loading: theoriesLoading,
      link: '/theories',
      description: 'Learning materials',
    },
  ];

  const quickActions = [
    {
      title: 'Create Course',
      description: 'Start a new course',
      icon: BookOpen,
      link: '/courses',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Add Unit',
      description: 'Organize course content',
      icon: Layers,
      link: '/units',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Create Lesson',
      description: 'Design new lessons',
      icon: FileText,
      link: '/lessons',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Add Question',
      description: 'Create practice questions',
      icon: HelpCircle,
      link: '/questions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Calculate total content safely
  const totalContent = 
    (coursesData?.pagination?.totalRecords ?? 0) +
    (unitsData?.pagination?.totalRecords ?? 0) +
    (lessonsData?.pagination?.totalRecords ?? 0) +
    (questionsData?.pagination?.totalRecords ?? 0) +
    (theoriesData?.pagination?.totalRecords ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome to Duolingo Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.link}>
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Courses</p>
                    <p className="text-sm text-gray-500">Manage your courses</p>
                  </div>
                </div>
                <div className="text-right">
                  {coursesLoading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {coursesData?.pagination?.totalRecords ?? 0}
                      </p>
                      <Link to="/courses">
                        <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                          View all →
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Units</p>
                    <p className="text-sm text-gray-500">Organize content structure</p>
                  </div>
                </div>
                <div className="text-right">
                  {unitsLoading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {unitsData?.pagination?.totalRecords ?? 0}
                      </p>
                      <Link to="/units">
                        <Button variant="link" size="sm" className="text-green-600 p-0 h-auto">
                          View all →
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Lessons</p>
                    <p className="text-sm text-gray-500">Create learning content</p>
                  </div>
                </div>
                <div className="text-right">
                  {lessonsLoading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {lessonsData?.pagination?.totalRecords ?? 0}
                      </p>
                      <Link to="/lessons">
                        <Button variant="link" size="sm" className="text-purple-600 p-0 h-auto">
                          View all →
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Version</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Status</span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-600">Active</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Total Content</span>
                <span className="font-medium text-gray-900">
                  {totalContent}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Environment</span>
                <span className="font-medium text-gray-900">
                  {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">💡 Quick Tip</p>
                <p className="text-xs text-blue-600">
                  Use the hierarchy: Course → Unit → Lesson to organize your content effectively.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Questions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Multiple Choice</span>
                  <span className="text-sm font-medium text-orange-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Gap Fill</span>
                  <span className="text-sm font-medium text-orange-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Matching</span>
                  <span className="text-sm font-medium text-orange-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Ordering</span>
                  <span className="text-sm font-medium text-orange-600">Available</span>
                </div>
              </div>
              <Link to="/questions">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Questions
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Theories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Grammar</span>
                  <span className="text-sm font-medium text-yellow-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Phrases</span>
                  <span className="text-sm font-medium text-yellow-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Flashcards</span>
                  <span className="text-sm font-medium text-yellow-600">Available</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Theories</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {theoriesData?.pagination?.totalRecords ?? 0}
                  </span>
                </div>
              </div>
              <Link to="/theories">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Theories
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
