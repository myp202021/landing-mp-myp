#!/usr/bin/env python3
"""
Test Google Trends para Marketing Digital en Chile
Extrae tendencias de búsqueda relevantes para el mercado chileno
"""

from pytrends.request import TrendReq
import pandas as pd
from datetime import datetime, timedelta

# Configurar pytrends
pytrends = TrendReq(hl='es-CL', tz=360)

print("🔍 Analizando Google Trends para Marketing Digital en Chile\n")
print("="*70)

# 1. TENDENCIAS DE MARKETING DIGITAL EN CHILE
print("\n1️⃣ INTERÉS EN MARKETING DIGITAL (últimos 12 meses)")
print("-"*70)

keywords_marketing = [
    'marketing digital',
    'google ads',
    'meta ads',
    'tiktok ads',
    'seo'
]

try:
    pytrends.build_payload(keywords_marketing, cat=0, timeframe='today 12-m', geo='CL')

    # Interés a lo largo del tiempo
    interest_over_time = pytrends.interest_over_time()

    if not interest_over_time.empty:
        print("\n📊 Promedio de interés (0-100):")
        for keyword in keywords_marketing:
            if keyword in interest_over_time.columns:
                avg_interest = interest_over_time[keyword].mean()
                max_interest = interest_over_time[keyword].max()
                print(f"  {keyword:20} | Promedio: {avg_interest:5.1f} | Máximo: {max_interest}")

        print("\n📈 Últimas 4 semanas:")
        print(interest_over_time.tail(4)[keywords_marketing])

    # Interés por región (ciudades de Chile)
    print("\n\n2️⃣ INTERÉS POR REGIÓN EN CHILE")
    print("-"*70)

    interest_by_region = pytrends.interest_by_region(resolution='CITY', inc_low_vol=True, inc_geo_code=False)

    if not interest_by_region.empty:
        # Top 10 ciudades para "marketing digital"
        if 'marketing digital' in interest_by_region.columns:
            top_cities = interest_by_region['marketing digital'].sort_values(ascending=False).head(10)
            print("\n🌎 Top 10 ciudades buscando 'marketing digital':")
            for city, value in top_cities.items():
                print(f"  {city:30} | Interés: {value}")

except Exception as e:
    print(f"❌ Error en análisis principal: {e}")

# 3. CONSULTAS RELACIONADAS
print("\n\n3️⃣ CONSULTAS Y TEMAS RELACIONADOS")
print("-"*70)

try:
    pytrends.build_payload(['marketing digital'], cat=0, timeframe='today 3-m', geo='CL')

    related_queries = pytrends.related_queries()

    if 'marketing digital' in related_queries:
        queries = related_queries['marketing digital']

        if queries['top'] is not None and not queries['top'].empty:
            print("\n🔥 Top consultas relacionadas:")
            for idx, row in queries['top'].head(10).iterrows():
                print(f"  {row['query']:40} | Popularidad: {row['value']}")

        if queries['rising'] is not None and not queries['rising'].empty:
            print("\n📈 Consultas en tendencia (rising):")
            for idx, row in queries['rising'].head(10).iterrows():
                breakout = "🚀 BREAKOUT" if row['value'] == 'Breakout' else f"+{row['value']}%"
                print(f"  {row['query']:40} | {breakout}")

except Exception as e:
    print(f"❌ Error en consultas relacionadas: {e}")

# 4. COMPARACIÓN DE PLATAFORMAS PUBLICITARIAS
print("\n\n4️⃣ COMPARACIÓN: GOOGLE ADS vs META ADS vs TIKTOK ADS")
print("-"*70)

try:
    pytrends.build_payload(['google ads', 'facebook ads', 'instagram ads', 'tiktok ads'],
                          cat=0, timeframe='today 12-m', geo='CL')

    comparison = pytrends.interest_over_time()

    if not comparison.empty:
        print("\n📊 Promedios de interés:")
        for col in ['google ads', 'facebook ads', 'instagram ads', 'tiktok ads']:
            if col in comparison.columns:
                avg = comparison[col].mean()
                print(f"  {col:20} | {avg:5.1f}")

except Exception as e:
    print(f"❌ Error en comparación: {e}")

# 5. TENDENCIAS POR INDUSTRIA
print("\n\n5️⃣ INTERÉS POR INDUSTRIA EN CHILE")
print("-"*70)

industries = [
    'marketing inmobiliario',
    'marketing salud',
    'marketing retail',
    'marketing b2b',
    'marketing ecommerce'
]

try:
    pytrends.build_payload(industries[:5], cat=0, timeframe='today 12-m', geo='CL')

    industry_interest = pytrends.interest_over_time()

    if not industry_interest.empty:
        print("\n📊 Promedio de búsquedas por industria:")
        for industry in industries[:5]:
            if industry in industry_interest.columns:
                avg = industry_interest[industry].mean()
                trend = "📈" if industry_interest[industry].iloc[-1] > industry_interest[industry].iloc[-4] else "📉"
                print(f"  {trend} {industry:30} | {avg:5.1f}")

except Exception as e:
    print(f"❌ Error en industrias: {e}")

print("\n" + "="*70)
print("✅ Análisis completado")
print("\n💡 Nota: Valores de 0-100 representan interés relativo, no volumen absoluto")
