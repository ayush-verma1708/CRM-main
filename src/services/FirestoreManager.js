import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export const fetchAdmins = async () => {
    try {
        const adminCollectionRef = collection(db, 'adminPanel');
        const adminSnapshot = await getDocs(adminCollectionRef);
        const adminList = adminSnapshot.docs.map(doc => ({
            uid: doc.uid,
            ...doc.data(),
        }));

        // Assuming each document has an array of admins
        const admins = adminList.flatMap(admin => admin.admin || []);
        return admins;
    } catch (error) {
        console.error("Error fetching admins: ", error);
        return []; // Return an empty array in case of error
    }
};