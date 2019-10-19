export function firestoreCUD(firestore_collection, op, pk_key, pk_val, new_data, old_data, success_callback, failure_callback) {
    if (op === 'update') {
        var d = { ...new_data };
        delete d[pk_key];
        firestore_collection
            .doc(pk_val)
            .set(d, { merge: true })
            .then(success_callback).catch(failure_callback);
    }
    else if (op === 'create') {
        var d = { ...new_data };
        firestore_collection
            .doc(pk_val)
            .set(d)
            .then(success_callback).catch(failure_callback);
    }
    else if (op === 'delete') {
        firestore_collection
            .doc(pk_val)
            .delete()
            .then(success_callback)
            .catch(failure_callback);
    }
    success_callback();
}
