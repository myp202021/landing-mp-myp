#!/usr/bin/env python3
"""
Test Reddit API para análisis de marketing digital en Chile
Extrae conversaciones y tendencias de subreddits relevantes
"""

import requests
import json
from datetime import datetime

print("🔍 Analizando Reddit para Marketing Digital en Chile\n")
print("="*70)

# Reddit permite acceso sin autenticación para endpoints públicos
HEADERS = {
    'User-Agent': 'MarketingAnalyzer/1.0'
}

def get_reddit_posts(subreddit, limit=25, time_filter='month'):
    """Obtiene posts de un subreddit"""
    url = f'https://www.reddit.com/r/{subreddit}/top.json'
    params = {'limit': limit, 't': time_filter}

    try:
        response = requests.get(url, headers=HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error {response.status_code} en r/{subreddit}")
            return None
    except Exception as e:
        print(f"❌ Error conectando a r/{subreddit}: {e}")
        return None

def search_reddit(query, limit=25):
    """Busca posts en todo Reddit"""
    url = 'https://www.reddit.com/search.json'
    params = {'q': query, 'limit': limit, 'sort': 'relevance', 't': 'month'}

    try:
        response = requests.get(url, headers=HEADERS, params=params, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error {response.status_code} buscando '{query}'")
            return None
    except Exception as e:
        print(f"❌ Error buscando '{query}': {e}")
        return None

# 1. ANÁLISIS DE SUBREDDITS DE MARKETING
print("\n1️⃣ SUBREDDITS DE MARKETING MÁS RELEVANTES")
print("-"*70)

marketing_subreddits = [
    'marketing',
    'digital_marketing',
    'PPC',
    'SEO',
    'socialmedia'
]

for subreddit in marketing_subreddits[:3]:  # Limitado para no saturar
    print(f"\n📌 r/{subreddit}")
    data = get_reddit_posts(subreddit, limit=10, time_filter='week')

    if data and 'data' in data and 'children' in data['data']:
        posts = data['data']['children']
        print(f"   Posts encontrados: {len(posts)}")

        # Top 3 posts por engagement
        top_posts = sorted(posts, key=lambda x: x['data']['score'], reverse=True)[:3]

        for i, post in enumerate(top_posts, 1):
            p = post['data']
            score = p.get('score', 0)
            comments = p.get('num_comments', 0)
            title = p.get('title', '')[:60]
            print(f"\n   {i}. {title}...")
            print(f"      ⬆️  {score:,} upvotes | 💬 {comments} comments")

print("\n" + "="*70)

# 2. BÚSQUEDA DE TÉRMINOS RELACIONADOS CON CHILE
print("\n2️⃣ BÚSQUEDA: 'marketing digital chile'")
print("-"*70)

search_results = search_reddit('marketing digital chile', limit=10)

if search_results and 'data' in search_results and 'children' in search_results['data']:
    posts = search_results['data']['children']
    print(f"\n✅ Posts encontrados: {len(posts)}\n")

    for i, post in enumerate(posts[:5], 1):
        p = post['data']
        print(f"{i}. {p.get('title', '')[:70]}")
        print(f"   r/{p.get('subreddit', 'unknown')} | ⬆️  {p.get('score', 0)} | 💬 {p.get('num_comments', 0)}")
        print()

# 3. BÚSQUEDA DE TENDENCIAS ESPECÍFICAS
print("\n3️⃣ ANÁLISIS DE TENDENCIAS ACTUALES")
print("-"*70)

trending_topics = [
    'tiktok ads',
    'google performance max',
    'ai marketing'
]

for topic in trending_topics:
    print(f"\n🔥 '{topic}'")
    results = search_reddit(topic, limit=5)

    if results and 'data' in results and 'children' in results['data']:
        posts = results['data']['children']
        total_engagement = sum(p['data'].get('score', 0) + p['data'].get('num_comments', 0)
                             for p in posts)
        avg_engagement = total_engagement / len(posts) if posts else 0

        print(f"   Posts: {len(posts)} | Engagement promedio: {avg_engagement:.0f}")

        # Subreddits donde más se habla
        subreddits = [p['data'].get('subreddit', '') for p in posts]
        unique_subs = set(subreddits)
        print(f"   Subreddits: {', '.join(list(unique_subs)[:3])}")

# 4. ANÁLISIS DE r/chile (si existe contenido de marketing)
print("\n\n4️⃣ ANÁLISIS DE r/chile")
print("-"*70)

chile_data = search_reddit('marketing subreddit:chile', limit=10)

if chile_data and 'data' in chile_data and 'children' in chile_data['data']:
    posts = chile_data['data']['children']
    print(f"\n✅ Posts sobre marketing en r/chile: {len(posts)}\n")

    for i, post in enumerate(posts[:3], 1):
        p = post['data']
        print(f"{i}. {p.get('title', '')[:70]}")
        print(f"   ⬆️  {p.get('score', 0)} | 💬 {p.get('num_comments', 0)}")
        print()
else:
    print("\n⚠️ Poca actividad de marketing en r/chile")

print("\n" + "="*70)
print("✅ Análisis de Reddit completado")
print("\n📌 Nota: Reddit API pública tiene límites de 60 requests/minuto")
print("💡 Para análisis más profundo, considera autenticación OAuth")
