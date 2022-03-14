/* eslint linebreak-style: ["error", "windows"] */

/* eslint no-restricted-globals: "off" */
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const http = require('http');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const client = new MongoClient(`mongodb+srv://nishee0798:${process.env.ATLAS_PASSWORD}@cs648-02.6d82c.mongodb.net/Assignment-4`, {
  useUnifiedTopology: true,
});

let inventory;
let counter;
client.connect((err, cl) => {
  const db = cl.db();
  inventory = db.collection('inventory');
  counter = db.collection('counter');
});

async function getNextSequence() {
  const result = await counter.findOneAndUpdate(
    { },
    { $inc: { count: 1 } },
    { returnOriginal: false },
  );
  return result.value.count;
}

const resolvers = {
  Query: {
    productList: async () => {
      try {
        const result = await inventory.find({}).toArray();
        return result;
      } catch (error) {
        return [];
      }
    },
  },
  Mutation: {
    addProduct: async (_, {
      Category, Price, Name, Image,
    }) => {
      const PRODUCT = {
        id: await getNextSequence(),
        Category,
        Price,
        Name,
        Image,
      };
      const result = await inventory.insertOne(PRODUCT);
      const savedIssue = await inventory.findOne({ _id: result.insertedId });
      return savedIssue;
    },
  },
};

/* eslint linebreak-style: "off" */

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => {
    httpServer.listen({ port: process.env.API_PORT }, resolve);
  });
  console.log(`🚀 Server ready at http://localhost:${process.env.API_PORT}`);
}

startApolloServer();
