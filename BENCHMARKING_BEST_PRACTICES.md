# Best Practices: Benchmarking y Data Sharing para Marketing

Investigación exhaustiva de herramientas de benchmarking, patrones UX y librerías React para dashboards de marketing.

---

## 1. REFERENTES DEL MERCADO

### 1.1 Databox

**Características principales:**
- **Benchmark Visualization**: Usa "Hill Charts" y "Bar Line Charts" para mostrar:
  - Valor mediano (punto medio del cohort)
  - Tu valor vs industria
  - Rangos de cuartiles (25% inferior, 50% central, 25% superior)
  - Código de colores: ROJO cuando estás debajo de la mediana, VERDE cuando estás adelante

- **Cohort Filtering**: Filtros por industria, tipo de compañía, tamaño, revenue anual
- **Data Source**: Datos anonimizados de 150,000+ campañas de marketing

**Visualización de Quartiles:**
```
┌─────────────────────────────────────┐
│  Lower Bound ──────┐                │
│  1st Quartile ─────┼────┐           │
│  MEDIAN ───────────┼────┼───●       │ (Tu posición)
│  3rd Quartile ─────┼────┘           │
│  Upper Bound ──────┘                │
└─────────────────────────────────────┘
```

**Patrones de Tooltips:**
- Hover sobre elementos muestra métricas totales y cambios porcentuales
- Tooltips para explicar acronimos y métricas complejas
- "About" panel con definición, fórmula, owner, última actualización

---

### 1.2 AgencyAnalytics

**Lanzamiento (Nov 2024):** Benchmarks, Forecasting y Anomaly Detection

**Características:**
- **Industry Benchmarking**: Compara métricas contra medianas de industria (últimos 30 días)
- **Data Source**: +150,000 campañas de marketing profesional
- **Platform Coverage**: +80 integraciones
- **Visualization**: Area graphs con overlay de benchmark vs performance real

**Navegación:**
```
Client Campaign → Insights Icon (menu izq) → Benchmarks page
```

**Widget Options:**
- Benchmark area graph puede agregarse como widget a dashboard o como sección en reporte
- Identificación visual de wins y performance gaps

---

### 1.3 Klipfolio

**Tooltip Patterns:**
- Hover en gráficos segmentados resalta datos de cada segmento
- Tooltip muestra texto más oscuro para el punto específico
- Chart muestra color más profundo para segmento seleccionado
- Hover en filtros muestra lista de filtros aplicados

**Context Features:**
- Opción "About" con información completa de métrica (source, owner, refresh time, definición con fórmula)
- Contexto visual: mostrar datos relacionados juntos (ej: sales data + marketing spend)

**Visualizations:**
- Segmented bar/column charts con hover states
- Support para indicadores de periodos parciales en tooltips

---

### 1.4 WordStream Performance Grader

**Scoring System:**
- Overall account score basado en 10 métricas clave
- Benchmark comparisons contra cuentas con budgets similares
- Data: +$3B en AdWords spend analizado

**Métricas evaluadas:**
1. Wasted spend
2. Quality Score
3. Impression share
4. Click-through rate
5. Account activity

**UI Patterns:**
- Summary inicial en top con proprietary score
- Links contextuales para profundizar en insights
- Performance Tracker: análisis automático cada 30 días
- Mobile Readiness Score
- Quality Score tracking temporal (no disponible en Google)

---

### 1.5 SEMrush

**Dashboard Components:**

**Market Overview:**
- Market share por competitor
- Growth Quadrant visualization
- Traffic share graphs
- Keyword overlap analysis

**Traffic & Market Toolkit:**
- Traffic Overview como launchpad
- Demographics dashboard (age, gender, location)
- Audience Overlap visualization
- Daily Trends monitoring

**Monitoring:**
- EyeOn dashboard: tracking en near real-time
- Website changes, blog activity, new pages
- Compare domains (hasta 4 URLs simultáneas)
- Competitive comparison tables

---

## 2. PATRONES UI/UX ESPECÍFICOS

### 2.1 Rangos de Validación

**Databox Pattern:**
```jsx
// Concepto visual de quartile ranges
{
  lowerBound: 0,
  firstQuartile: 25,    // 25% de valores son menores
  median: 50,           // 50% de valores son menores
  thirdQuartile: 75,    // 75% de valores son menores
  upperBound: 100,
  yourValue: 68         // Tu posición
}
```

**Visual Encoding:**
- **Área clara**: Top/Bottom 25% (performers extremos)
- **Área oscura**: 50% central (performance típica)
- **Indicador destacado**: Tu posición con marker especial

**Color Coding:**
```jsx
const getPerformanceColor = (yourValue, median) => {
  if (yourValue < median * 0.8) return 'red';      // Bajo performance
  if (yourValue < median) return 'orange';          // Por debajo
  if (yourValue < median * 1.2) return 'green';    // Buen performance
  return 'emerald';                                 // Excelente
};
```

---

### 2.2 Explicación de Métricas

#### Tooltip Pattern (shadcn/ui)

```jsx
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

export function MetricTooltip({ metric, description, formula }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            {metric}
            <InfoIcon className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{metric}</p>
            <p className="text-sm text-gray-600">{description}</p>
            {formula && (
              <code className="block text-xs bg-gray-100 p-2 rounded">
                {formula}
              </code>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Uso
<MetricTooltip
  metric="CTR"
  description="Click-through rate measures the percentage of impressions that resulted in clicks"
  formula="(Clicks / Impressions) × 100"
/>
```

#### Popover Pattern (shadcn/ui) - Para información más compleja

```jsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function MetricPopover({ metric, details, benchmark, tips }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">Learn more about {metric}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{metric}</h4>
            <p className="text-sm text-gray-600">{details}</p>
          </div>

          {benchmark && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm font-medium text-blue-900">Industry Benchmark</p>
              <p className="text-2xl font-bold text-blue-700">{benchmark}</p>
            </div>
          )}

          {tips && (
            <div>
              <p className="font-medium text-sm mb-2">Tips to improve:</p>
              <ul className="text-sm space-y-1">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

#### Modal Pattern - Para deep-dives

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function MetricModal({ metric, data }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800">
          View detailed breakdown
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{metric} - Detailed Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Charts, tables, comparisons */}
          <MetricChart data={data} />
          <HistoricalTrends data={data} />
          <IndustryComparison data={data} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

### 2.3 Visualizaciones para Comparativas

#### Benchmark Area Chart (Recharts)

```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

export function BenchmarkAreaChart({ data, median, yourData }) {
  return (
    <AreaChart width={800} height={400} data={data}>
      <defs>
        <linearGradient id="colorQuartile1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#fee2e2" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#fee2e2" stopOpacity={0.1}/>
        </linearGradient>
        <linearGradient id="colorQuartile2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.3}/>
        </linearGradient>
        <linearGradient id="colorQuartile3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#d1fae5" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#d1fae5" stopOpacity={0.1}/>
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />

      {/* Bottom 25% */}
      <Area
        type="monotone"
        dataKey="lowerBound"
        stackId="1"
        stroke="#ef4444"
        fill="url(#colorQuartile1)"
        name="Bottom 25%"
      />

      {/* Middle 50% */}
      <Area
        type="monotone"
        dataKey="q1ToMedian"
        stackId="1"
        stroke="#3b82f6"
        fill="url(#colorQuartile2)"
        name="Typical Range (25-75%)"
      />

      {/* Top 25% */}
      <Area
        type="monotone"
        dataKey="medianToQ3"
        stackId="1"
        stroke="#10b981"
        fill="url(#colorQuartile3)"
        name="Top 25%"
      />

      {/* Median line */}
      <ReferenceLine
        y={median}
        stroke="#6366f1"
        strokeWidth={2}
        strokeDasharray="5 5"
        label={{ value: 'Industry Median', position: 'insideTopRight' }}
      />

      {/* Your performance line */}
      <Line
        type="monotone"
        dataKey="yourValue"
        stroke="#f59e0b"
        strokeWidth={3}
        dot={{ fill: '#f59e0b', r: 5 }}
        name="Your Performance"
      />
    </AreaChart>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium">{entry.value.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
};
```

#### Bullet Chart Pattern (Tu vs Industria)

```jsx
export function BulletChart({
  actual,
  target,
  poor,
  satisfactory,
  good,
  label
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">
          {actual} / {target} (target)
        </span>
      </div>

      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
        {/* Poor range */}
        <div
          className="absolute h-full bg-red-200"
          style={{ width: `${(poor / target) * 100}%` }}
        />

        {/* Satisfactory range */}
        <div
          className="absolute h-full bg-yellow-200"
          style={{
            left: `${(poor / target) * 100}%`,
            width: `${((satisfactory - poor) / target) * 100}%`
          }}
        />

        {/* Good range */}
        <div
          className="absolute h-full bg-green-200"
          style={{
            left: `${(satisfactory / target) * 100}%`,
            width: `${((good - satisfactory) / target) * 100}%`
          }}
        />

        {/* Actual value bar */}
        <div
          className="absolute h-full bg-blue-600 opacity-80"
          style={{ width: `${(actual / target) * 100}%` }}
        />

        {/* Target marker */}
        <div
          className="absolute h-full w-1 bg-gray-800"
          style={{ left: `${(target / target) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Poor</span>
        <span>Satisfactory</span>
        <span>Good</span>
      </div>
    </div>
  );
}
```

#### Growth Quadrant (SEMrush style)

```jsx
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';

export function GrowthQuadrant({ competitors, median }) {
  const quadrants = {
    leaders: { x: median.marketShare, y: median.growth },
    challengers: { x: median.marketShare, y: -median.growth },
  };

  return (
    <div className="space-y-4">
      <ScatterChart width={600} height={600} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="marketShare"
          name="Market Share"
          label={{ value: 'Market Share →', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="growth"
          name="Growth Rate"
          label={{ value: '← Growth Rate', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />

        {/* Quadrant lines */}
        <ReferenceLine x={quadrants.leaders.x} stroke="#cbd5e1" strokeWidth={2} />
        <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />

        <Scatter name="Competitors" data={competitors}>
          {competitors.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isYou ? '#f59e0b' : '#3b82f6'}
            />
          ))}
        </Scatter>
      </ScatterChart>

      {/* Quadrant labels */}
      <div className="grid grid-cols-2 gap-4 text-center text-sm">
        <div className="bg-green-50 p-3 rounded">
          <p className="font-semibold text-green-900">Leaders</p>
          <p className="text-xs text-green-700">High growth, High share</p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <p className="font-semibold text-blue-900">Established</p>
          <p className="text-xs text-blue-700">Low growth, High share</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <p className="font-semibold text-yellow-900">Challengers</p>
          <p className="text-xs text-yellow-700">High growth, Low share</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-semibold text-gray-900">Emerging</p>
          <p className="text-xs text-gray-700">Low growth, Low share</p>
        </div>
      </div>
    </div>
  );
}
```

---

### 2.4 Gamificación de Contribución

#### Badge System

```jsx
import { Trophy, Star, Target, Award } from "lucide-react"

const badges = [
  {
    id: 'first_share',
    name: 'Data Contributor',
    description: 'Shared your first benchmark data',
    icon: Star,
    color: 'blue'
  },
  {
    id: 'consistent',
    name: 'Consistent Reporter',
    description: '30 days of consecutive reporting',
    icon: Target,
    color: 'green'
  },
  {
    id: 'top_performer',
    name: 'Top Performer',
    description: 'Reached top 10% in your industry',
    icon: Trophy,
    color: 'yellow'
  },
  {
    id: 'helper',
    name: 'Community Helper',
    description: 'Helped improve 5+ industry benchmarks',
    icon: Award,
    color: 'purple'
  },
];

export function BadgeCard({ badge, earned, progress }) {
  const Icon = badge.icon;
  const isEarned = earned;

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all
      ${isEarned
        ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg'
        : 'border-gray-200 bg-gray-50 opacity-60'
      }
    `}>
      {isEarned && (
        <div className="absolute -top-2 -right-2">
          <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-xs font-bold">
            ✓
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`
          p-3 rounded-full
          ${isEarned ? `bg-${badge.color}-100` : 'bg-gray-200'}
        `}>
          <Icon className={`
            w-6 h-6
            ${isEarned ? `text-${badge.color}-600` : 'text-gray-400'}
          `} />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-sm">{badge.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{badge.description}</p>

          {!isEarned && progress && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BadgeShowcase({ badges, earnedIds }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Achievements</h3>
        <span className="text-sm text-gray-600">
          {earnedIds.length} / {badges.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earnedIds.includes(badge.id)}
            progress={badge.progress}
          />
        ))}
      </div>
    </div>
  );
}
```

#### Progress Ring (Percentile Badge)

```jsx
export function PercentileRing({ percentile, total = 100 }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentile / total) * circumference;

  const getColor = (p) => {
    if (p >= 90) return '#10b981'; // Green
    if (p >= 75) return '#3b82f6'; // Blue
    if (p >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getMessage = (p) => {
    if (p >= 90) return 'Exceptional!';
    if (p >= 75) return 'Great job!';
    if (p >= 50) return 'Good work!';
    return 'Keep improving!';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="160" height="160" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={getColor(percentile)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: getColor(percentile) }}>
            {percentile}%
          </span>
          <span className="text-xs text-gray-600 mt-1">percentile</span>
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg">{getMessage(percentile)}</p>
        <p className="text-sm text-gray-600">
          You're performing better than {percentile}% of similar businesses
        </p>
      </div>
    </div>
  );
}
```

#### Leaderboard Component

```jsx
import { Medal } from "lucide-react"

export function Leaderboard({ entries, currentUserId }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <h3 className="text-white font-semibold text-lg">Industry Leaderboard</h3>
        <p className="text-blue-100 text-sm">Top performers this month</p>
      </div>

      <div className="divide-y divide-gray-200">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.id === currentUserId;
          const rank = index + 1;

          return (
            <div
              key={entry.id}
              className={`
                flex items-center gap-4 p-4 transition-colors
                ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}
              `}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex items-center justify-center">
                {rank <= 3 ? (
                  <Medal
                    className={`w-8 h-8 ${
                      rank === 1 ? 'text-yellow-500' :
                      rank === 2 ? 'text-gray-400' :
                      'text-orange-600'
                    }`}
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {rank}
                  </span>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isCurrentUser ? 'text-blue-900' : ''}`}>
                  {entry.name} {isCurrentUser && '(You)'}
                </p>
                <p className="text-sm text-gray-600">{entry.company}</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{entry.score}</p>
                <p className="text-xs text-gray-600">{entry.metric}</p>
              </div>

              {/* Trend */}
              <div className={`
                flex items-center gap-1 text-sm font-medium
                ${entry.trend > 0 ? 'text-green-600' : 'text-red-600'}
              `}>
                <span>{entry.trend > 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(entry.trend)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 2.5 Incentivos para Compartir Datos

**Sistema SAPS (Status, Access, Power, Stuff):**

```jsx
const incentiveSystem = {
  status: {
    // Menos costoso para la compañía, MÁS sticky para el usuario
    examples: [
      'Verified Contributor badge',
      'Top 10% performer recognition',
      'Featured in industry reports',
      'Profile highlight in community'
    ]
  },

  access: {
    examples: [
      'Early access to new features',
      'Exclusive industry reports',
      'Private community access',
      'Beta program invitation'
    ]
  },

  power: {
    examples: [
      'Custom benchmark cohorts',
      'Advanced filtering options',
      'API access',
      'Custom integrations'
    ]
  },

  stuff: {
    // MÁS costoso para la compañía, menos sticky para el usuario
    examples: [
      'Premium features discount',
      'Extended data retention',
      'Priority support',
      'Swag and merchandise'
    ]
  }
};

export function IncentiveCard({ tier, points, unlocked }) {
  return (
    <div className={`
      p-6 rounded-lg border-2 transition-all
      ${unlocked
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 bg-white'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-lg">{tier.name}</h4>
          <p className="text-sm text-gray-600">{tier.description}</p>
        </div>
        {unlocked && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Unlocked
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {tier.benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <span className="text-green-600">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      {!unlocked && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to unlock</span>
            <span>{points.current} / {points.required} points</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${(points.current / points.required) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

**Contribution Tracker:**

```jsx
export function ContributionTracker({ stats }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Your Contribution Impact</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.dataPoints}</p>
          <p className="text-sm text-gray-600">Data Points Shared</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.businesses}</p>
          <p className="text-sm text-gray-600">Businesses Helped</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{stats.insights}</p>
          <p className="text-sm text-gray-600">Insights Generated</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Community Impact</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${stats.impactPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium">{stats.impactPercentage}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your data has helped make benchmarks {stats.impactPercentage}% more accurate!
        </p>
      </div>
    </div>
  );
}
```

---

### 2.6 "Tu Posición" vs Industria

#### Comparison Card

```jsx
export function VsIndustryCard({ metric, yourValue, industryMedian, industryRange, trend }) {
  const percentDiff = ((yourValue - industryMedian) / industryMedian * 100).toFixed(1);
  const isAbove = yourValue >= industryMedian;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm text-gray-600">{metric}</h3>
          <p className="text-3xl font-bold mt-1">{yourValue}</p>
        </div>

        <div className={`
          flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
          ${isAbove ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}>
          <span>{isAbove ? '↑' : '↓'}</span>
          <span>{Math.abs(percentDiff)}%</span>
        </div>
      </div>

      {/* Visual comparison */}
      <div className="space-y-3">
        {/* Your bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-blue-900">You</span>
            <span className="text-gray-600">{yourValue}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${(yourValue / industryRange.max) * 100}%` }}
            />
          </div>
        </div>

        {/* Industry median bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">Industry Median</span>
            <span className="text-gray-600">{industryMedian}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400"
              style={{ width: `${(industryMedian / industryRange.max) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className={`
        mt-4 p-3 rounded-lg text-sm
        ${isAbove ? 'bg-green-50 text-green-900' : 'bg-orange-50 text-orange-900'}
      `}>
        <p className="font-medium mb-1">
          {isAbove ? '🎉 Great job!' : '💡 Opportunity to improve'}
        </p>
        <p className="text-xs">
          {isAbove
            ? `You're performing ${Math.abs(percentDiff)}% above the industry median.`
            : `You're ${Math.abs(percentDiff)}% below median. Consider these improvements...`
          }
        </p>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">30-day trend</span>
            <div className={`
              flex items-center gap-1 font-medium
              ${trend > 0 ? 'text-green-600' : 'text-red-600'}
            `}>
              <span>{trend > 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Position Indicator

```jsx
export function PositionIndicator({ percentile, total }) {
  const position = Math.ceil((100 - percentile) / 100 * total);

  return (
    <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">Your Position</p>
        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          #{position}
        </p>
        <p className="text-sm text-gray-600 mt-2">out of {total.toLocaleString()} businesses</p>
      </div>

      {/* Percentile bar */}
      <div className="relative h-12 bg-white rounded-lg overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex">
          {/* Bottom tier */}
          <div className="flex-1 bg-red-100" />
          {/* Mid-low tier */}
          <div className="flex-1 bg-orange-100" />
          {/* Mid tier */}
          <div className="flex-1 bg-yellow-100" />
          {/* Mid-high tier */}
          <div className="flex-1 bg-green-100" />
          {/* Top tier */}
          <div className="flex-1 bg-emerald-100" />
        </div>

        {/* Your marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-indigo-600 shadow-lg"
          style={{ left: `${percentile}%` }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              You are here
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Bottom 20%</span>
        <span>Top 20%</span>
      </div>

      {/* Achievement message */}
      {percentile >= 80 && (
        <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
          <p className="text-yellow-900 font-medium text-sm">
            🏆 You're in the top {100 - percentile}% of your industry!
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### 2.7 Insights Automáticos (AI-Generated)

```jsx
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"

const insightTypes = {
  trend: { icon: TrendingUp, color: 'blue' },
  opportunity: { icon: Lightbulb, color: 'yellow' },
  anomaly: { icon: AlertCircle, color: 'red' },
  success: { icon: Sparkles, color: 'green' }
};

export function InsightCard({ insight }) {
  const { icon: Icon, color } = insightTypes[insight.type];

  return (
    <div className={`
      p-4 rounded-lg border-l-4
      ${color === 'blue' ? 'border-blue-500 bg-blue-50' : ''}
      ${color === 'yellow' ? 'border-yellow-500 bg-yellow-50' : ''}
      ${color === 'red' ? 'border-red-500 bg-red-50' : ''}
      ${color === 'green' ? 'border-green-500 bg-green-50' : ''}
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-full
          ${color === 'blue' ? 'bg-blue-100' : ''}
          ${color === 'yellow' ? 'bg-yellow-100' : ''}
          ${color === 'red' ? 'bg-red-100' : ''}
          ${color === 'green' ? 'bg-green-100' : ''}
        `}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>

          {insight.metrics && (
            <div className="flex gap-4 text-xs text-gray-600 mb-2">
              {insight.metrics.map((metric, idx) => (
                <div key={idx}>
                  <span className="font-medium">{metric.label}:</span>{' '}
                  <span>{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          {insight.recommendations && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-medium text-gray-700">Recommendations:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {insight.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insight.action && (
            <button className={`
              mt-3 text-sm font-medium px-3 py-1 rounded
              ${color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
              ${color === 'yellow' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : ''}
              ${color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
              ${color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
            `}>
              {insight.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InsightsFeed({ insights }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI-Generated Insights
        </h3>
        <span className="text-sm text-gray-600">
          Updated 5 minutes ago
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

// Ejemplo de uso
const exampleInsights = [
  {
    id: 1,
    type: 'trend',
    title: 'CTR improving faster than industry',
    description: 'Your CTR has increased 23% in the last 30 days, while industry median only grew 8%.',
    metrics: [
      { label: 'Your growth', value: '+23%' },
      { label: 'Industry avg', value: '+8%' }
    ],
    recommendations: [
      'Continue current ad copy strategy',
      'Consider scaling budget for top-performing campaigns'
    ],
    action: { label: 'View Campaign Details', url: '/campaigns' }
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'CPC opportunity identified',
    description: 'Your CPC is 35% higher than industry median. Optimizing could save $2,400/month.',
    metrics: [
      { label: 'Your CPC', value: '$2.70' },
      { label: 'Industry median', value: '$2.00' }
    ],
    recommendations: [
      'Review Quality Score for low-performing keywords',
      'Test automated bidding strategies',
      'Consider negative keyword additions'
    ],
    action: { label: 'Optimize Now', url: '/optimize' }
  },
  {
    id: 3,
    type: 'anomaly',
    title: 'Unusual drop in conversion rate',
    description: 'Conversion rate decreased 18% yesterday. This is 3σ from your 30-day average.',
    metrics: [
      { label: 'Yesterday', value: '2.1%' },
      { label: '30-day avg', value: '2.6%' }
    ],
    recommendations: [
      'Check landing page for technical issues',
      'Verify tracking pixel is firing correctly',
      'Review recent campaign changes'
    ],
    action: { label: 'Investigate', url: '/diagnostics' }
  }
];
```

---

### 2.8 Progressive Disclosure

#### Accordion Pattern (Headless UI)

```jsx
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export function MetricDetailsAccordion({ metrics }) {
  return (
    <div className="space-y-2">
      {metrics.map((metric) => (
        <Disclosure key={metric.id}>
          {({ open }) => (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DisclosureButton className="flex w-full justify-between items-center p-4 text-left bg-white hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{metric.name}</p>
                    <p className="text-2xl font-bold text-blue-600">{metric.value}</p>
                  </div>
                </div>

                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    open ? 'transform rotate-180' : ''
                  }`}
                />
              </DisclosureButton>

              <DisclosurePanel className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>

                  {metric.benchmark && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Industry Benchmark</h4>
                      <BenchmarkChart data={metric.benchmark} />
                    </div>
                  )}

                  {metric.history && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">30-Day Trend</h4>
                      <MiniChart data={metric.history} />
                    </div>
                  )}

                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View full analysis →
                  </button>
                </div>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
```

#### Tabs Pattern

```jsx
import { Tab } from '@headlessui/react'

export function MetricDetailTabs({ metric }) {
  const tabs = ['Overview', 'Trends', 'Benchmark', 'Recommendations'];

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
              }`
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="mt-4">
        <Tab.Panel className="space-y-4">
          {/* Overview content */}
          <MetricOverview metric={metric} />
        </Tab.Panel>

        <Tab.Panel className="space-y-4">
          {/* Trends content */}
          <MetricTrends metric={metric} />
        </Tab.Panel>

        <Tab.Panel className="space-y-4">
          {/* Benchmark content */}
          <MetricBenchmark metric={metric} />
        </Tab.Panel>

        <Tab.Panel className="space-y-4">
          {/* Recommendations content */}
          <MetricRecommendations metric={metric} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
```

---

### 2.9 Micro-interacciones (Framer Motion)

```jsx
import { motion, AnimatePresence } from 'framer-motion'

// Hover card animation
export function AnimatedMetricCard({ metric, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm text-gray-600">{metric.label}</h3>
        <motion.p
          className="text-3xl font-bold mt-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {metric.value}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Number counter animation
export function AnimatedCounter({ value, duration = 1 }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const end = parseInt(value);
    if (end === count) return;

    const incrementTime = (duration / end) * 1000;
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev < end) return prev + 1;
        clearInterval(timer);
        return end;
      });
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, count, duration]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1.2, color: '#3b82f6' }}
      animate={{ scale: 1, color: '#111827' }}
      transition={{ duration: 0.3 }}
    >
      {count}
    </motion.span>
  );
}

// Progress bar animation
export function AnimatedProgress({ value, max = 100 }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

// Badge pop animation
export function AnimatedBadge({ badge, earned }) {
  return (
    <AnimatePresence>
      {earned && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.2, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="bg-yellow-100 border-2 border-yellow-500 rounded-full p-3"
          >
            {badge.icon}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification toast animation
export function AnimatedToast({ message, type = 'success', onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        p-4 rounded-lg shadow-lg
        ${type === 'success' ? 'bg-green-500 text-white' : ''}
        ${type === 'error' ? 'bg-red-500 text-white' : ''}
        ${type === 'info' ? 'bg-blue-500 text-white' : ''}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          ×
        </button>
      </div>
    </motion.div>
  );
}

// Staggered list animation
export function AnimatedList({ items }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

### 2.10 Empty States

```jsx
import { Database, TrendingUp, Users } from "lucide-react"

export function EmptyState({ type = 'data', title, description, action }) {
  const icons = {
    data: Database,
    benchmark: TrendingUp,
    community: Users
  };

  const Icon = icons[type];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || "No data yet"}
      </h3>

      <p className="text-sm text-gray-600 max-w-sm mb-6">
        {description || "Get started by connecting your first data source."}
      </p>

      {action && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          {action.label}
        </button>
      )}

      {/* Decorative illustration */}
      <div className="mt-8 opacity-20">
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
          <rect x="20" y="60" width="30" height="40" fill="#cbd5e1" rx="4" />
          <rect x="60" y="40" width="30" height="60" fill="#cbd5e1" rx="4" />
          <rect x="100" y="20" width="30" height="80" fill="#cbd5e1" rx="4" />
          <rect x="140" y="50" width="30" height="50" fill="#cbd5e1" rx="4" />
        </svg>
      </div>
    </div>
  );
}

// Specific empty states
export function NoBenchmarksEmptyState() {
  return (
    <EmptyState
      type="benchmark"
      title="No benchmark data available"
      description="Share your first data points to unlock industry benchmarks and see how you compare."
      action={{
        label: "Start Sharing Data",
        onClick: () => {}
      }}
    />
  );
}

export function NoContributionsEmptyState() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-semibold mb-2">Start Contributing Today</h3>
        <p className="text-gray-600 mb-6">
          Two parts instruction, one part delight: Share your data to help the community
          and unlock exclusive features!
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium">Better Benchmarks</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm font-medium">Earn Badges</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🔓</div>
            <p className="text-sm font-medium">Unlock Features</p>
          </div>
        </div>

        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
          Contribute Your First Data Point
        </button>
      </div>
    </div>
  );
}
```

---

### 2.11 Loading States

```jsx
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Basic skeleton for metric cards
export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Skeleton width={100} height={16} />
      <Skeleton width={120} height={36} className="mt-2" />
      <Skeleton width={80} height={20} className="mt-2" />
    </div>
  );
}

// Skeleton for chart
export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Skeleton width={150} height={20} className="mb-4" />
      <Skeleton height={300} />
      <div className="flex gap-4 mt-4">
        <Skeleton width={80} height={16} />
        <Skeleton width={80} height={16} />
        <Skeleton width={80} height={16} />
      </div>
    </div>
  );
}

// Skeleton for table
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Skeleton width={200} height={24} />
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, idx) => (
          <div key={idx} className="p-4 flex gap-4">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={14} className="mt-2" />
            </div>
            <Skeleton width={80} height={24} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Shimmer effect component (custom)
export function ShimmerLoader({ width = '100%', height = 20, className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        width,
        height,
        animation: 'shimmer 1.5s infinite'
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// Loading state with progress
export function ProgressLoader({ message = 'Loading...', progress = null }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-16 h-16 relative mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>

      <p className="text-gray-600 font-medium mb-2">{message}</p>

      {progress !== null && (
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Benchmark-specific loading state
export function BenchmarkLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={28} />
        <Skeleton width={120} height={36} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      <ChartSkeleton />

      <div className="grid grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
```

---

### 2.12 Error States

```jsx
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export function ErrorState({
  type = 'generic',
  title,
  message,
  errorCode,
  onRetry,
  onGoBack
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || "Something went wrong"}
      </h3>

      <p className="text-sm text-gray-600 max-w-md mb-2">
        {message || "We encountered an error while loading this data. Please try again."}
      </p>

      {errorCode && (
        <p className="text-xs text-gray-500 mb-6">
          Error code: {errorCode}
        </p>
      )}

      <div className="flex gap-3">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Specific error states
export function NoDataError() {
  return (
    <ErrorState
      type="no-data"
      title="No data available"
      message="We couldn't find any data for the selected time period. Try adjusting your filters."
      onRetry={() => window.location.reload()}
    />
  );
}

export function ConnectionError() {
  return (
    <ErrorState
      type="connection"
      title="Connection failed"
      message="Unable to connect to the server. Please check your internet connection and try again."
      errorCode="ERR_NETWORK"
      onRetry={() => window.location.reload()}
    />
  );
}

export function PermissionError() {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6 text-orange-600" />
      </div>
      <h3 className="font-semibold text-orange-900 mb-2">
        Access Restricted
      </h3>
      <p className="text-sm text-orange-800 mb-4">
        You don't have permission to view this benchmark data.
        Upgrade your plan or contact support for access.
      </p>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
        Upgrade Plan
      </button>
    </div>
  );
}

// Inline error for form fields
export function InlineError({ message }) {
  return (
    <div className="flex items-start gap-2 text-red-600 text-sm mt-1">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
```

---

### 2.13 Onboarding Patterns

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function OnboardingFlow({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete({ ...formData, ...data });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Progress sidebar */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-6">Get Started</h2>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg transition-all
                    ${idx === currentStep
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : idx < currentStep
                      ? 'bg-green-50'
                      : 'bg-white'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm
                    ${idx === currentStep
                      ? 'bg-blue-600 text-white'
                      : idx < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${
                      idx === currentStep ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  {steps[currentStep].component({
                    onNext: handleNext,
                    onBack: handleBack,
                    data: formData
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example onboarding steps
const onboardingSteps = [
  {
    title: 'Welcome',
    description: 'Introduction to benchmarking',
    component: ({ onNext }) => (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-3xl font-bold">Welcome to Benchmarks</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Compare your performance against industry standards and unlock insights
          to grow your business faster.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-medium text-sm">Industry Benchmarks</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <p className="font-medium text-sm">Performance Insights</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-medium text-sm">Growth Opportunities</p>
          </div>
        </div>
        <button
          onClick={() => onNext({})}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    )
  },
  {
    title: 'Your Industry',
    description: 'Tell us about your business',
    component: ({ onNext, onBack, data }) => {
      const [selected, setSelected] = useState(data.industry || '');

      const industries = [
        'E-commerce', 'SaaS', 'Healthcare', 'Finance',
        'Real Estate', 'Education', 'Manufacturing', 'Other'
      ];

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">What industry are you in?</h3>
            <p className="text-gray-600">
              This helps us show you relevant benchmarks from similar businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelected(industry)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${selected === industry
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <p className="font-medium">{industry}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => onNext({ industry: selected })}
              disabled={!selected}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }
  },
  {
    title: 'Connect Data',
    description: 'Link your marketing platforms',
    component: ({ onNext, onBack }) => (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Connect your data sources</h3>
          <p className="text-gray-600">
            Link your marketing platforms to start comparing your performance.
          </p>
        </div>

        <div className="space-y-3">
          {['Google Ads', 'Facebook Ads', 'Google Analytics'].map((platform) => (
            <button
              key={platform}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <span className="font-medium">{platform}</span>
              </div>
              <span className="text-blue-600 opacity-0 group-hover:opacity-100">
                Connect →
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => onNext({})}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    )
  }
];
```

---

## 3. LIBRERÍAS REACT RECOMENDADAS

### 3.1 Visualización de Datos

#### **Recharts** (Recomendado para empezar rápido)
```bash
npm install recharts
```

**Pros:**
- API simple y declarativa
- 24.8K+ stars en GitHub
- Perfecto para dashboards estándar
- SVG rendering limpio
- Responsive out-of-the-box

**Cons:**
- Menos flexible que D3/Visx
- Customización limitada en casos complejos

**Uso típico:**
```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<AreaChart width={600} height={300} data={data}>
  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</AreaChart>
```

---

#### **Visx** (Recomendado para máximo control)
```bash
npm install @visx/visx
```

**Pros:**
- Máxima flexibilidad y customización
- Built by Airbnb sobre D3
- Tree-shakable (performance óptimo)
- Low-level primitives
- Soporte SVG y Canvas

**Cons:**
- Learning curve más empinada
- Requiere más código para gráficos básicos

**Uso típico:**
```jsx
import { AreaClosed } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { curveMonotoneX } from '@visx/curve';

<svg width={width} height={height}>
  <AreaClosed
    data={data}
    x={d => xScale(getX(d))}
    y={d => yScale(getY(d))}
    yScale={yScale}
    strokeWidth={1}
    stroke="url(#area-gradient)"
    fill="url(#area-gradient)"
    curve={curveMonotoneX}
  />
</svg>
```

---

#### **Tremor** (Recomendado para dashboards rápidos)
```bash
npm install @tremor/react
```

**Pros:**
- 35+ componentes listos para usar
- Built con Recharts + Radix UI + Tailwind
- +250 blocks y templates
- Ideal para prototipos y MVPs

**Cons:**
- Menos flexible para casos muy específicos
- Estilo opinionado (aunque customizable con Tailwind)

**Uso típico:**
```jsx
import { Card, AreaChart, Title } from '@tremor/react';

<Card>
  <Title>Performance</Title>
  <AreaChart
    data={data}
    index="date"
    categories={["metric1", "metric2"]}
    colors={["blue", "green"]}
  />
</Card>
```

---

#### **Nivo** (Alternativa popular)
```bash
npm install @nivo/core @nivo/line @nivo/bar
```

**Pros:**
- 27 tipos de gráficos
- Animaciones suaves
- Server-side rendering
- Documentación interactiva excelente

**Cons:**
- Bundle size más grande que Visx
- Menos flexible que Visx para customización extrema

---

### 3.2 UI Components

#### **shadcn/ui** (ALTAMENTE RECOMENDADO)
```bash
npx shadcn-ui@latest init
```

**Por qué es el mejor:**
- Copy-paste components (no es una dependencia)
- Built con Radix UI + Tailwind
- 100% customizable (código es tuyo)
- Accesible por defecto (WCAG compliant)
- TypeScript native

**Componentes clave para dashboards:**
```bash
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

---

#### **Radix UI** (Base de shadcn/ui)
```bash
npm install @radix-ui/react-tooltip @radix-ui/react-popover
```

**Ideal si quieres:**
- Máximo control sobre estilos
- Components headless (sin estilos)
- 32 componentes primitivos
- Accesibilidad garantizada

---

#### **Headless UI** (Alternativa oficial de Tailwind)
```bash
npm install @headlessui/react
```

**Pros:**
- Diseñado para Tailwind CSS
- Soporte React y Vue
- Mantenido por Tailwind Labs

**Cons:**
- Menos componentes que Radix (16 vs 32)
- Solo React exclusivo (Radix más universal)

---

### 3.3 Animaciones

#### **Framer Motion**
```bash
npm install framer-motion
```

**Uso esencial en dashboards:**
```jsx
import { motion } from 'framer-motion'

// Hover effects
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>

// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
>

// Staggered animations
<motion.div variants={containerVariants}>
  {items.map(item => (
    <motion.div variants={itemVariants} key={item.id} />
  ))}
</motion.div>
```

---

### 3.4 Loading States

#### **react-loading-skeleton**
```bash
npm install react-loading-skeleton
```

**Uso:**
```jsx
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

<Skeleton count={5} />
<Skeleton circle width={40} height={40} />
```

---

### 3.5 Notifications

#### **react-hot-toast** (Recomendado)
```bash
npm install react-hot-toast
```

**Por qué:**
- Ligero (< 5KB)
- API simple
- Animaciones smooth
- Customizable

```jsx
import toast from 'react-hot-toast';

toast.success('Data shared successfully!');
toast.error('Failed to load benchmarks');
toast.loading('Calculating...');
```

#### **react-toastify** (Alternativa con más features)
```bash
npm install react-toastify
```

---

### 3.6 Icons

#### **Lucide React** (Recomendado)
```bash
npm install lucide-react
```

**Por qué:**
- Fork de Feather Icons con más iconos
- Tree-shakable
- Consistente con shadcn/ui
- 1000+ iconos

```jsx
import { TrendingUp, AlertCircle, Trophy } from 'lucide-react'

<TrendingUp className="w-4 h-4 text-green-600" />
```

---

## 4. STACK RECOMENDADO COMPLETO

### Setup Inicial
```bash
# Create Next.js app con TypeScript y Tailwind
npx create-next-app@latest benchmark-dashboard --typescript --tailwind --app

cd benchmark-dashboard

# Install shadcn/ui
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add tooltip popover dialog tabs card badge button

# Install visualization
npm install recharts

# Install animations
npm install framer-motion

# Install utilities
npm install react-loading-skeleton react-hot-toast lucide-react

# Optional: Advanced charts
npm install @visx/visx

# Optional: Pre-built dashboard components
npm install @tremor/react
```

---

### Estructura de Proyecto Recomendada

```
/app
  /dashboard
    /benchmarks
      page.tsx
    /insights
      page.tsx
    layout.tsx
/components
  /ui              # shadcn components
    tooltip.tsx
    popover.tsx
    card.tsx
  /charts          # Custom chart components
    BenchmarkAreaChart.tsx
    BulletChart.tsx
    GrowthQuadrant.tsx
  /metrics         # Metric display components
    MetricCard.tsx
    VsIndustryCard.tsx
    PositionIndicator.tsx
  /gamification    # Gamification components
    BadgeCard.tsx
    Leaderboard.tsx
    PercentileRing.tsx
  /states          # Empty, loading, error states
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx
/lib
  /utils
    benchmark-calculations.ts
    chart-helpers.ts
/hooks
  useBenchmarkData.ts
  useIndustryMedian.ts
```

---

## 5. PATRONES DE IMPLEMENTACIÓN CLAVE

### 5.1 Custom Hook para Benchmarks

```typescript
import { useQuery } from '@tanstack/react-query'

export function useBenchmarkData(industry: string, metric: string) {
  return useQuery({
    queryKey: ['benchmark', industry, metric],
    queryFn: async () => {
      const response = await fetch(`/api/benchmarks?industry=${industry}&metric=${metric}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Uso
const { data, isLoading, error } = useBenchmarkData('ecommerce', 'ctr');

if (isLoading) return <BenchmarkLoadingSkeleton />;
if (error) return <ErrorState onRetry={() => refetch()} />;

return <BenchmarkChart data={data} />;
```

---

### 5.2 Tooltip Provider Global

```tsx
// app/layout.tsx
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

---

### 5.3 Responsive Chart Wrapper

```tsx
import { useEffect, useRef, useState } from 'react'

export function ResponsiveChartWrapper({ children }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 400
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      {dimensions.width > 0 && children(dimensions)}
    </div>
  );
}

// Uso
<ResponsiveChartWrapper>
  {({ width, height }) => (
    <AreaChart width={width} height={height} data={data}>
      {/* ... */}
    </AreaChart>
  )}
</ResponsiveChartWrapper>
```

---

## 6. RECURSOS Y REFERENCIAS

### Documentación Oficial
- **Recharts**: https://recharts.org/
- **Visx**: https://airbnb.io/visx/
- **Tremor**: https://tremor.so/
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://radix-ui.com/
- **Framer Motion**: https://framer.com/motion/

### Design Systems de Referencia
- **Vercel**: https://vercel.com/design
- **Stripe**: https://stripe.com/docs/api
- **Linear**: https://linear.app/

### Pattern Libraries
- **UI Patterns**: https://ui-patterns.com/
- **Mobbin**: https://mobbin.com/ (mobile + web patterns)
- **Dribbble - Dashboard**: https://dribbble.com/tags/dashboard

### Benchmarking Tools para Estudiar
- **Databox Benchmarks**: https://benchmarks.databox.com/
- **AgencyAnalytics**: https://agencyanalytics.com/feature/benchmarks
- **WordStream Performance Grader**: https://www.wordstream.com/google-adwords

---

## 7. CONCLUSIONES Y RECOMENDACIONES

### Para empezar RÁPIDO:
```
Next.js + Tailwind + shadcn/ui + Tremor + react-hot-toast
```

### Para MÁXIMO CONTROL:
```
Next.js + Tailwind + Radix UI + Visx + Framer Motion
```

### Para PRODUCCIÓN (balance ideal):
```
Next.js + TypeScript + Tailwind
+ shadcn/ui (UI primitives)
+ Recharts (visualizations)
+ Framer Motion (animations)
+ react-loading-skeleton (loading states)
+ react-hot-toast (notifications)
+ Lucide React (icons)
```

### Patrones UX Críticos para Benchmarking:
1. **Quartile visualization** con Hill Charts o Bar Line Charts
2. **Color coding** consistente (red below, green above median)
3. **Tooltips everywhere** para explicar métricas complejas
4. **Progressive disclosure** con accordions/tabs
5. **Gamification** con badges, progress rings, leaderboards
6. **SAPS incentive system** (Status > Access > Power > Stuff)
7. **AI-generated insights** con categorización por tipo
8. **Empty states** con "2 parts instruction, 1 part delight"
9. **Micro-interactions** para feedback inmediato
10. **Position indicators** con percentile rings y comparison cards

---

**Última actualización:** Octubre 2025
**Basado en:** Análisis de Databox, AgencyAnalytics, Klipfolio, WordStream, SEMrush y best practices de UI/UX 2025
