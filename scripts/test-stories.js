const fetch = require('node-fetch')
const APIFY_TOKEN = process.env.APIFY_TOKEN

async function test() {
  console.log('🔍 Testing Instagram Story scraper with viggo_chile...')
  
  const res = await fetch(
    `https://api.apify.com/v2/acts/louisdeconinck~instagram-story-details-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: ['viggo_chile']
      })
    }
  )
  
  if (!res.ok) {
    console.log('❌ Error:', res.status, await res.text())
    return
  }
  
  const data = await res.json()
  console.log('✅ Stories encontradas:', data.length)
  
  for (const story of data.slice(0, 5)) {
    console.log('  ---')
    console.log('  User:', story.username || story.user?.username || '?')
    console.log('  Type:', story.type || story.media_type || '?')
    console.log('  Timestamp:', story.taken_at || story.timestamp || story.takenAt || '?')
    console.log('  URL:', (story.url || story.media_url || story.video_url || story.image_url || '?').substring(0, 100))
    console.log('  Caption:', (story.caption || story.text || '').substring(0, 100) || 'sin texto')
  }
  
  if (data.length === 0) {
    console.log('  (viggo_chile no tiene stories activas en este momento)')
  }
}
test().catch(e => console.error('💥', e.message))
