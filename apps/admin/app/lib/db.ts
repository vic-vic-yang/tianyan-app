import { ObjectId } from 'mongodb'
import clientPromise from './mongodb'

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  return { client, db }
}

export async function createDocument(collection: string, document: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection(collection).insertOne(document)
  return result
}

export async function readDocuments(collection: string, query = {}) {
  const { db } = await connectToDatabase()
  const documents = await db.collection(collection).find(query).toArray()
  return JSON.parse(JSON.stringify(documents))
}

export async function updateDocument(collection: string, id: string, update: any) {
  const { db } = await connectToDatabase()
  const result = await db.collection(collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  )
  return result
}

export async function deleteDocument(collection: string, id: string) {
  const { db } = await connectToDatabase()
  const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) })
  return result
}
