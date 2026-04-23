/**
 * IndexedDB 数据存储工具
 */

const DB_NAME = 'LioranHomeDB'
const DB_VERSION = 1

// 数据库初始化
let dbPromise = null

function initDB() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // 对话存储
      if (!db.objectStoreNames.contains('conversations')) {
        const convStore = db.createObjectStore('conversations', { keyPath: 'id' })
        convStore.createIndex('updatedAt', 'updatedAt', { unique: false })
      }

      // 消息存储
      if (!db.objectStoreNames.contains('messages')) {
        const msgStore = db.createObjectStore('messages', { keyPath: 'id' })
        msgStore.createIndex('conversationId', 'conversationId', { unique: false })
        msgStore.createIndex('timestamp', 'timestamp', { unique: false })
      }

      // 设置存储
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }

      // 记忆存储
      if (!db.objectStoreNames.contains('memories')) {
        const memStore = db.createObjectStore('memories', { keyPath: 'id' })
        memStore.createIndex('date', 'date', { unique: false })
        memStore.createIndex('pinned', 'pinned', { unique: false })
      }
    }
  })

  return dbPromise
}

// ===== 对话管理 =====

export async function saveConversation(conversation) {
  const db = await initDB()
  const tx = db.transaction('conversations', 'readwrite')
  await tx.objectStore('conversations').put(conversation)
  await tx.complete
}

export async function getConversation(id) {
  const db = await initDB()
  return await db.transaction('conversations').objectStore('conversations').get(id)
}

export async function getAllConversations() {
  const db = await initDB()
  const tx = db.transaction('conversations')
  const store = tx.objectStore('conversations')
  const index = store.index('updatedAt')
  return await index.getAll()
}

export async function deleteConversation(id) {
  const db = await initDB()
  const tx = db.transaction(['conversations', 'messages'], 'readwrite')
  
  // 删除对话
  await tx.objectStore('conversations').delete(id)
  
  // 删除该对话的所有消息
  const msgStore = tx.objectStore('messages')
  const msgIndex = msgStore.index('conversationId')
  const messages = await msgIndex.getAll(id)
  for (const msg of messages) {
    await msgStore.delete(msg.id)
  }
  
  await tx.complete
}

// ===== 消息管理 =====

export async function saveMessage(message) {
  const db = await initDB()
  const tx = db.transaction('messages', 'readwrite')
  await tx.objectStore('messages').put(message)
  await tx.complete
}

export async function getMessages(conversationId) {
  const db = await initDB()
  const tx = db.transaction('messages')
  const index = tx.objectStore('messages').index('conversationId')
  const messages = await index.getAll(conversationId)
  return messages.sort((a, b) => a.timestamp - b.timestamp)
}

export async function deleteMessage(id) {
  const db = await initDB()
  const tx = db.transaction('messages', 'readwrite')
  await tx.objectStore('messages').delete(id)
  await tx.complete
}

// ===== 设置管理 =====

export async function saveSetting(key, value) {
  const db = await initDB()
  const tx = db.transaction('settings', 'readwrite')
  await tx.objectStore('settings').put({ key, value })
  await tx.complete
}

export async function getSetting(key, defaultValue = null) {
  const db = await initDB()
  const result = await db.transaction('settings').objectStore('settings').get(key)
  return result ? result.value : defaultValue
}

export async function getAllSettings() {
  const db = await initDB()
  const items = await db.transaction('settings').objectStore('settings').getAll()
  return items.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {})
}

// ===== 记忆管理 =====

export async function saveMemory(memory) {
  const db = await initDB()
  const tx = db.transaction('memories', 'readwrite')
  await tx.objectStore('memories').put(memory)
  await tx.complete
}

export async function getAllMemories() {
  const db = await initDB()
  const tx = db.transaction('memories')
  const store = tx.objectStore('memories')
  return await store.getAll()
}

export async function deleteMemory(id) {
  const db = await initDB()
  const tx = db.transaction('memories', 'readwrite')
  await tx.objectStore('memories').delete(id)
  await tx.complete
}