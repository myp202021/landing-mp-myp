// radar-api-helper.js
// Helper para llamadas API con retry, backoff y verificación de truncamiento
// Usado por todos los agentes de Copilot

var fetch = require('node-fetch')

// ═══════════════════════════════════════════════
// FETCH CON RETRY Y BACKOFF
// ═══════════════════════════════════════════════
async function fetchWithRetry(url, options, maxRetries, label) {
  maxRetries = maxRetries || 3
  label = label || 'API'
  var lastError = null

  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      var res = await fetch(url, options)

      // Rate limit (429) o server error (500+): retry con backoff
      if (res.status === 429 || res.status >= 500) {
        var waitMs = Math.min(attempt * 3000, 15000) // 3s, 6s, 9s...
        console.log('   ' + label + ': HTTP ' + res.status + ', retry ' + attempt + '/' + maxRetries + ' en ' + (waitMs/1000) + 's')
        await new Promise(function(r) { setTimeout(r, waitMs) })
        continue
      }

      // Otros errores: no retry
      if (!res.ok) {
        var errText = await res.text()
        throw new Error(label + ': HTTP ' + res.status + ' ' + errText.substring(0, 200))
      }

      return res
    } catch (e) {
      lastError = e
      if (attempt < maxRetries && (e.message.includes('ETIMEDOUT') || e.message.includes('ECONNRESET') || e.message.includes('fetch failed'))) {
        var waitMs = attempt * 3000
        console.log('   ' + label + ': ' + e.message.substring(0, 60) + ', retry ' + attempt + '/' + maxRetries)
        await new Promise(function(r) { setTimeout(r, waitMs) })
        continue
      }
      throw e
    }
  }
  throw lastError || new Error(label + ': max retries exceeded')
}

// ═══════════════════════════════════════════════
// LLAMADA OPENAI CON RETRY + TRUNCATION CHECK
// ═══════════════════════════════════════════════
async function callOpenAI(apiKey, model, messages, options, label) {
  options = options || {}
  label = label || 'OpenAI'
  var temperature = options.temperature || 0.6
  var maxTokens = options.max_tokens || 3000
  var jsonMode = options.json_mode !== false // default true
  var systemPrompt = options.system || null

  var body = {
    model: model || 'gpt-4o-mini',
    temperature: temperature,
    max_tokens: maxTokens,
    messages: messages,
  }
  if (jsonMode) body.response_format = { type: 'json_object' }
  if (systemPrompt) {
    body.messages = [{ role: 'system', content: systemPrompt }].concat(messages)
  }

  var res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, 3, label)

  var data = await res.json()
  var content = data.choices[0].message.content || ''
  var finishReason = data.choices[0].finish_reason

  // Truncation check
  if (finishReason === 'length') {
    console.log('   ⚠️  ' + label + ': TRUNCADO (finish_reason=length). Reintentando con más tokens...')
    body.max_tokens = Math.min(maxTokens * 2, 8000)
    var res2 = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 2, label + ' retry-truncation')
    var data2 = await res2.json()
    content = data2.choices[0].message.content || content
    if (data2.choices[0].finish_reason === 'length') {
      console.log('   ⚠️  ' + label + ': aún truncado después de retry. Usando respuesta parcial.')
    }
  }

  return { content: content, finishReason: finishReason, usage: data.usage }
}

// ═══════════════════════════════════════════════
// LLAMADA ANTHROPIC CON RETRY + TRUNCATION CHECK
// ═══════════════════════════════════════════════
async function callAnthropic(apiKey, model, messages, options, label) {
  options = options || {}
  label = label || 'Claude'
  var maxTokens = options.max_tokens || 1500
  var systemPrompt = options.system || null

  var body = {
    model: model || 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: messages,
  }
  if (systemPrompt) body.system = systemPrompt

  var res = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }, 3, label)

  var data = await res.json()
  var content = data.content && data.content[0] ? data.content[0].text : ''
  var stopReason = data.stop_reason

  // Truncation check
  if (stopReason === 'max_tokens') {
    console.log('   ⚠️  ' + label + ': TRUNCADO (stop_reason=max_tokens). Reintentando con más tokens...')
    body.max_tokens = Math.min(maxTokens * 2, 4096)
    var res2 = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }, 2, label + ' retry-truncation')
    var data2 = await res2.json()
    content = data2.content && data2.content[0] ? data2.content[0].text : content
    if (data2.stop_reason === 'max_tokens') {
      console.log('   ⚠️  ' + label + ': aún truncado. Usando respuesta parcial.')
    }
  }

  return { content: content, stopReason: stopReason, usage: data.usage }
}

module.exports = {
  fetchWithRetry: fetchWithRetry,
  callOpenAI: callOpenAI,
  callAnthropic: callAnthropic,
}
