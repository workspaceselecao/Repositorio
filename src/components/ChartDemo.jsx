'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function ChartDemo() {
  const chartData = [
    { name: 'Vagas Ativas', value: 45, color: 'chart-1' },
    { name: 'Clientes', value: 32, color: 'chart-2' },
    { name: 'Aplicações', value: 28, color: 'chart-3' },
    { name: 'Contratos', value: 15, color: 'chart-4' },
    { name: 'Pendências', value: 8, color: 'chart-5' },
  ]

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
          <span>Demonstração das Cores do Tema Blue</span>
        </CardTitle>
        <CardDescription>
          Paleta de cores otimizada para visualização de dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-4 h-4 bg-${item.color} rounded-full`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.value} itens
                  </div>
                </div>
                <div className={`text-lg font-bold text-${item.color}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-chart-1/10 to-chart-2/10 border border-chart-1/20">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Cores do Tema Blue v3
            </h4>
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center">
                <div className="w-8 h-8 bg-chart-1 rounded mx-auto mb-1"></div>
                <div className="text-xs text-muted-foreground">Chart 1</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-chart-2 rounded mx-auto mb-1"></div>
                <div className="text-xs text-muted-foreground">Chart 2</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-chart-3 rounded mx-auto mb-1"></div>
                <div className="text-xs text-muted-foreground">Chart 3</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-chart-4 rounded mx-auto mb-1"></div>
                <div className="text-xs text-muted-foreground">Chart 4</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-chart-5 rounded mx-auto mb-1"></div>
                <div className="text-xs text-muted-foreground">Chart 5</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
