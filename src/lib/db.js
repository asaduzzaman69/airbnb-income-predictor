import { addDoc, collection, doc } from "firebase/firestore"
import { db } from "./firebase"


export const createEstimate = async (estimatedObj, cb) => {
    const docRef = collection(db, 'estimated')

    try {
        await addDoc(docRef, {
            ...estimatedObj,
            id: docRef.id
        });

        cb(true)

    } catch (err) {
        console.log(err)
    }
}