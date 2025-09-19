'use client'

import DashboardLayout from '../../components/DashboardLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { ProgressiveDashboard } from '../../components/ProgressiveDashboard'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import ChartDemo from '../../components/ChartDemo'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  Target,
  Activity,
  Zap,
  Star
} from 'lucide-react'

export default function DashboardPage() {
  // Usar o componente progressivo que gerencia seu próprio loading

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ProgressiveDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}