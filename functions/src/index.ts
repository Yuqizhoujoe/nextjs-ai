/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { QueryDocumentSnapshot } from "firebase-functions/lib/v1/providers/firestore";
import { EventContext } from "firebase-functions/lib/v1/cloud-functions";

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");

exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap: QueryDocumentSnapshot, context: EventContext) => {
    const original = snap.data().original;
    console.log("Uppercasing", context.params.documentId, original);
    const uppercase = original.toUpperCase();
    return snap.ref.set({ uppercase }, { merge: true });
  });
