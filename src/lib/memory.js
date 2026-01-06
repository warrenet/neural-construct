import { getSupabase } from './supabase'

/**
 * Deep Memory Service
 * Handles text chunking and vector storage
 */

// Simple chunking strategy
function chunkText(text, size = 1000, overlap = 100) {
    const chunks = []
    let i = 0
    while (i < text.length) {
        chunks.push(text.slice(i, i + size))
        i += size - overlap
    }
    return chunks
}

/**
 * Store a document in the Deep Memory
 * @param {string} content - Full text context
 * @param {string} source - Filename or URL
 * @param {Function} embeddingFn - Function that returns number[] for a string
 */
export async function memorizeDocument(content, source, embeddingFn) {
    const sb = getSupabase()
    if (!sb) throw new Error("Cloud Disconnected")

    const chunks = chunkText(content)
    console.log(`🧠 Memorizing ${chunks.length} chunks from ${source}...`)

    const records = []

    for (const chunk of chunks) {
        // Generate embedding (using provided function or default API)
        const embedding = await embeddingFn(chunk)

        records.push({
            user_id: (await sb.auth.getUser()).data.user.id,
            content: chunk,
            source,
            embedding
        })
    }

    // Batch insert
    const { error } = await sb.from('memories').insert(records)
    if (error) throw error

    return chunks.length
}

/**
 * Recall relevant memories
 * @param {string} query - The search query
 * @param {Function} embeddingFn - Function to vectorize query
 */
export async function recallMemories(query, embeddingFn) {
    const sb = getSupabase()
    if (!sb) return []

    const queryVec = await embeddingFn(query)

    const { data, error } = await sb.rpc('match_memories', {
        query_embedding: queryVec,
        match_threshold: 0.7, // 70% similarity
        match_count: 5        // Top 5 chunks
    })

    if (error) {
        console.error('Recall Error:', error)
        return []
    }

    return data
}
