
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookText, Clock, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, quizResults, attentionScore } = useAppContext();

  // Generate stats from quiz results
  const totalQuizzesTaken = quizResults.length;
  const averageAccuracy = quizResults.length > 0 
    ? quizResults.reduce((acc, result) => acc + result.accuracy, 0) / quizResults.length
    : 0;
  const averageTimeTaken = quizResults.length > 0
    ? quizResults.reduce((acc, result) => acc + result.timeTaken, 0) / quizResults.length
    : 0;

  // Format quiz history data for chart
  const quizHistoryData = quizResults.map((result, index) => ({
    name: `Quiz ${index + 1}`,
    date: format(new Date(result.date), 'MMM d'),
    score: (result.score / result.totalQuestions) * 100,
    time: result.timeTaken,
  }));

  // Data for attention level pie chart
  const attentionData = [
    { name: 'Attentive', value: attentionScore },
    { name: 'Distracted', value: 100 - attentionScore },
  ];
  const COLORS = ['#9b87f5', '#e5e5e5'];

  // Extract weak points from all quizzes
  const allWeakPoints = quizResults.flatMap(r => r.weakPoints);
  const weakPointsFrequency = allWeakPoints.reduce((acc: Record<string, number>, point) => {
    acc[point] = (acc[point] || 0) + 1;
    return acc;
  }, {});
  const topWeakPoints = Object.entries(weakPointsFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([point]) => point);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your learning progress overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Quizzes Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalQuizzesTaken}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BookText className="h-6 w-6 text-avatar-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{averageAccuracy.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="bg-green-500 h-full rounded-full" 
                style={{ width: `${averageAccuracy}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Time Per Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{averageTimeTaken.toFixed(1)}s</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Attention Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{attentionScore}%</p>
              </div>
              <div className={`p-2 rounded-full ${attentionScore > 70 ? 'bg-green-100' : 'bg-amber-100'}`}>
                <AlertTriangle className={`h-6 w-6 ${attentionScore > 70 ? 'text-green-600' : 'text-amber-600'}`} />
              </div>
            </div>
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full">
              <div 
                className={`h-full rounded-full ${attentionScore > 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: `${attentionScore}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quiz Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={quizHistoryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#9b87f5"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Time Per Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={quizHistoryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#7E69AB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Attention Level</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attentionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            {topWeakPoints.length > 0 ? (
              <ul className="space-y-4">
                {topWeakPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="p-1 bg-red-100 rounded-full mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{point}</p>
                      <p className="text-sm text-gray-500">
                        Try reviewing this topic again or ask your AI tutor for more help.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Complete some quizzes to see your improvement areas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
