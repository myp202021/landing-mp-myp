# Integración Google Ads API → Predictor (Alternativa Realista)

## ¿Por qué NO usar Marketing Analytics Jumpstart todavía?

Marketing Analytics Jumpstart es EXCELENTE pero requiere:
- Setup complejo de GCP (Terraform, Vertex AI, Dataform)
- Clientes con GA4 + Google Ads exportando a BigQuery DIARIAMENTE
- Costos de GCP no especificados (puede escalar rápido)
- Infraestructura que requiere mantenimiento

**Para el Predictor actual, es overkill.**

---

## ✅ Alternativa Realista: Google Ads API + BigQuery Free Tier

### Fase 1: Google Ads API para Data Histórica (1 día)

**Objetivo:** Saca data REAL de campañas de clientes para mejorar el Predictor

**Setup:**

1. **Crear Google Ads API credentials**
```bash
# Necesitas:
# - Developer token (gratis,申请 en Google Ads)
# - OAuth2 credentials (Google Cloud Console)
# - Customer ID del cliente
```

2. **Instalar cliente Python**
```bash
pip install google-ads
```

3. **Configurar google-ads.yaml**
```yaml
developer_token: YOUR_DEVELOPER_TOKEN
client_id: YOUR_CLIENT_ID
client_secret: YOUR_CLIENT_SECRET
refresh_token: YOUR_REFRESH_TOKEN
login_customer_id: YOUR_MANAGER_ACCOUNT_ID
```

4. **Script para sacar data histórica**
```python
# scripts/fetch_google_ads_data.py
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import pandas as pd
from datetime import datetime, timedelta

def fetch_campaign_performance(client, customer_id, days_back=90):
    """
    Saca métricas de campañas de los últimos N días
    """
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
          campaign.id,
          campaign.name,
          campaign.advertising_channel_type,
          metrics.clicks,
          metrics.impressions,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.ctr,
          segments.date
        FROM campaign
        WHERE
          segments.date DURING LAST_{days_back}_DAYS
          AND campaign.status = 'ENABLED'
        ORDER BY segments.date DESC
    """

    try:
        response = ga_service.search_stream(customer_id=customer_id, query=query)

        data = []
        for batch in response:
            for row in batch.results:
                data.append({
                    'date': row.segments.date,
                    'campaign_id': row.campaign.id,
                    'campaign_name': row.campaign.name,
                    'channel': row.campaign.advertising_channel_type.name,
                    'clicks': row.metrics.clicks,
                    'impressions': row.metrics.impressions,
                    'cost': row.metrics.cost_micros / 1_000_000,  # Convertir a CLP
                    'conversions': row.metrics.conversions,
                    'conversion_value': row.metrics.conversions_value,
                    'avg_cpc': row.metrics.average_cpc / 1_000_000,
                    'ctr': row.metrics.ctr,
                })

        df = pd.DataFrame(data)
        return df

    except GoogleAdsException as ex:
        print(f"Request failed: {ex}")
        return None

# Uso
client = GoogleAdsClient.load_from_storage("google-ads.yaml")
customer_id = "1234567890"  # Sin guiones

df = fetch_campaign_performance(client, customer_id, days_back=180)
df.to_csv(f'data/google_ads_historical_{customer_id}.csv', index=False)
```

5. **Análisis de data histórica**
```python
# scripts/analyze_performance.py
import pandas as pd
import numpy as np

def calculate_industry_benchmarks(df, industry):
    """
    Calcula benchmarks reales por industria
    """
    metrics = {
        'avg_ctr': df['ctr'].mean(),
        'avg_cpc': df['avg_cpc'].mean(),
        'avg_conversion_rate': (df['conversions'] / df['clicks']).mean(),
        'avg_roas': (df['conversion_value'] / df['cost']).mean(),
        'median_cost_per_conversion': (df['cost'] / df['conversions']).median(),
    }

    return metrics

# Agregar a M&P Intelligence
benchmarks_by_industry = {}
for industry in df['industry'].unique():
    industry_data = df[df['industry'] == industry]
    benchmarks_by_industry[industry] = calculate_industry_benchmarks(industry_data, industry)
```

---

### Fase 2: BigQuery + BQML para Predicciones (2 días)

**Objetivo:** Crear modelos ML simples GRATIS con BigQuery ML

**Setup:**

1. **Exportar Google Ads a BigQuery**
- En Google Ads → Tools → Data transfer
- Seleccionar "Google Ads (AdWords) to BigQuery"
- Frecuencia: Daily
- **100% GRATIS** (no se cobra por el export)

2. **Crear dataset en BigQuery**
```sql
-- En BigQuery console
CREATE SCHEMA `your-project.google_ads_data`
OPTIONS(
  location="us",
  description="Google Ads export data"
);
```

3. **Modelo de proyección de conversiones (ARIMA)**
```sql
-- models/conversion_forecast.sql
-- Predice conversiones de los próximos 30 días

CREATE OR REPLACE MODEL `your-project.google_ads_data.conversion_forecast_model`
OPTIONS(
  model_type='ARIMA_PLUS',
  time_series_timestamp_col='date',
  time_series_data_col='conversions',
  auto_arima=TRUE,
  data_frequency='DAILY'
) AS
SELECT
  DATE(day) as date,
  SUM(conversions) as conversions
FROM
  `your-project.google_ads_data.AdGroupBasicStats_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY date
ORDER BY date;

-- Predecir próximos 30 días
SELECT
  *
FROM
  ML.FORECAST(MODEL `your-project.google_ads_data.conversion_forecast_model`,
              STRUCT(30 AS horizon, 0.95 AS confidence_level))
```

4. **Modelo de probabilidad de conversión**
```sql
-- models/conversion_probability.sql
-- Predice probabilidad de conversión basado en features

CREATE OR REPLACE MODEL `your-project.google_ads_data.conversion_probability_model`
OPTIONS(
  model_type='LOGISTIC_REG',
  input_label_cols=['converted']
) AS
SELECT
  device,
  ad_network_type,
  hour,
  day_of_week,
  click_type,
  cost / 1000000 as cost_clp,
  IF(conversions > 0, 1, 0) as converted
FROM
  `your-project.google_ads_data.ClickStats_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND clicks > 0;

-- Usar predicción
SELECT
  predicted_converted,
  predicted_converted_probs[OFFSET(0)].prob as probability
FROM
  ML.PREDICT(MODEL `your-project.google_ads_data.conversion_probability_model`,
    (SELECT 'mobile' as device, 'SEARCH' as ad_network_type, 14 as hour, 3 as day_of_week, 'HEADLINE' as click_type, 50 as cost_clp)
  )
```

5. **Integrar con el Predictor Next.js**
```typescript
// lib/bigquery-predictions.ts
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

export async function getConversionForecast(days: number = 30) {
  const query = `
    SELECT
      forecast_timestamp,
      forecast_value,
      standard_error,
      confidence_level,
      prediction_interval_lower_bound,
      prediction_interval_upper_bound
    FROM
      ML.FORECAST(MODEL \`${process.env.GCP_PROJECT_ID}.google_ads_data.conversion_forecast_model\`,
                  STRUCT(${days} AS horizon, 0.95 AS confidence_level))
    ORDER BY forecast_timestamp
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}

export async function predictConversionProbability(features: {
  device: string,
  ad_network: string,
  hour: number,
  day_of_week: number,
  cost: number
}) {
  const query = `
    SELECT
      predicted_converted,
      predicted_converted_probs[OFFSET(0)].prob as probability
    FROM
      ML.PREDICT(MODEL \`${process.env.GCP_PROJECT_ID}.google_ads_data.conversion_probability_model\`,
        (SELECT
          '${features.device}' as device,
          '${features.ad_network}' as ad_network_type,
          ${features.hour} as hour,
          ${features.day_of_week} as day_of_week,
          'HEADLINE' as click_type,
          ${features.cost} as cost_clp)
      )
  `;

  const [rows] = await bigquery.query(query);
  return rows[0];
}
```

6. **API endpoint para el Predictor**
```typescript
// app/api/predictions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConversionForecast } from '@/lib/bigquery-predictions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '30');

  try {
    const forecast = await getConversionForecast(days);

    return NextResponse.json({
      success: true,
      forecast,
      metadata: {
        model: 'BQML ARIMA_PLUS',
        confidence_level: 0.95,
        horizon_days: days
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
```

---

### Fase 3: Integrar con el Predictor UI (4 horas)

```typescript
// app/labs/predictor/PredictorClient.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function PredictorClient() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    const response = await fetch('/api/predictions?days=30');
    const data = await response.json();
    setForecast(data.forecast);
    setLoading(false);
  };

  return (
    <div>
      <h2>Predicción de Conversiones (próximos 30 días)</h2>
      <p className="text-sm text-gray-600">
        Basado en data REAL de Google Ads usando BQML ARIMA
      </p>

      {loading ? (
        <div>Cargando predicciones...</div>
      ) : (
        <LineChart width={800} height={400} data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="forecast_timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="forecast_value"
            stroke="#8884d8"
            name="Predicción"
          />
          <Line
            type="monotone"
            dataKey="prediction_interval_lower_bound"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            name="Límite inferior (95%)"
          />
          <Line
            type="monotone"
            dataKey="prediction_interval_upper_bound"
            stroke="#ffc658"
            strokeDasharray="5 5"
            name="Límite superior (95%)"
          />
        </LineChart>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          <strong>💡 Insight:</strong> {generateInsight(forecast)}
        </p>
      </div>
    </div>
  );
}

function generateInsight(forecast: any[]) {
  if (forecast.length === 0) return "Cargando...";

  const avgForecast = forecast.reduce((sum, row) => sum + row.forecast_value, 0) / forecast.length;
  const trend = forecast[forecast.length - 1].forecast_value > forecast[0].forecast_value ? "creciente" : "decreciente";

  return `Se proyectan ${Math.round(avgForecast)} conversiones promedio diarias en los próximos 30 días, con tendencia ${trend}.`;
}
```

---

## 💰 Costos Reales

| Servicio | Uso | Costo Mensual |
|----------|-----|---------------|
| Google Ads API | Unlimited requests | **GRATIS** |
| BigQuery Storage | < 10 GB | **GRATIS** (free tier) |
| BigQuery Queries | < 1 TB/mes | **GRATIS** (free tier) |
| BigQuery ML Training | < 10 GB procesados/mes | **GRATIS** (free tier) |
| BigQuery ML Predictions | < 1 GB procesados/mes | **GRATIS** (free tier) |

**Total: $0/mes** (si te mantienes en free tier)

---

## ✅ ROI de esta integración

**Valor para el Predictor:**
- ✅ Predicciones basadas en DATA REAL (no estimaciones)
- ✅ Modelos ML sin código custom (BQML)
- ✅ Actualizaciones automáticas (daily exports)
- ✅ Intervalos de confianza (95%)
- ✅ Insights automáticos
- ✅ $0 de costo

**Tiempo de implementación:**
- Fase 1: 1 día
- Fase 2: 2 días
- Fase 3: 4 horas
- **Total: 3 días**

---

## 🚀 Cuándo SÍ usar Marketing Analytics Jumpstart

Usa Marketing Analytics Jumpstart cuando:
1. Tengas **10+ clientes** con GA4 + Google Ads activo
2. Puedas **cobrar por el servicio** (para costear GCP)
3. Necesites **modelos avanzados** (CLTV, Churn, Propensity)
4. Tengas **equipo técnico** para mantener la infra

Hasta entonces, esta alternativa es MÁS QUE SUFICIENTE.
