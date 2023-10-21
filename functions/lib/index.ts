import { QueryDocumentSnapshot } from "firebase-functions/lib/v1/providers/firestore";
import { EventContext } from "firebase-functions/lib/v1/cloud-functions";
import { Change } from "firebase-functions/lib/common/change";

const functions = require("firebase-functions");

exports.makeUppercase = functions.firestore
  .document("/conversations/{documentId}")
  .onCreate((snap: QueryDocumentSnapshot, context: EventContext) => {
    console.log("onCreate makeUppercase");
    console.log("snap", snap);
    console.log("context", context);
    const original = snap.data().original;
    console.log("makeUppercase", context.params.documentId, original);
    const uppercase = original.toUpperCase();
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.makeUppercase = functions.firestore
  .document("/conversations/{documentId}")
  .onUpdate(
    (changedSnap: Change<QueryDocumentSnapshot>, context: EventContext) => {
      console.log("onUpdate makeUppercase");
      console.log("changedSnap", changedSnap);
      console.log("context", context);
      const original = changedSnap.after.data().original;
      console.log(
        "onUpdate makeUppercase",
        context.params.documentId,
        original
      );
      const uppercase = original.toUpperCase();
      return changedSnap.after.ref.set({ uppercase }, { merge: true });
    }
  );
