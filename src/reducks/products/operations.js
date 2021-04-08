import { db, FirebaseTimestamp } from "../../firebase";
import { push } from "connected-react-router";
import { ProductList } from "../../templates";
import { deleteProductAction, fetchProductsAction } from "./actions";

const productsRef = db.collection("products");

export const deleteProduct = (id, getState) => {
    return async (dispatch) => {
        productsRef
            .doc(id)
            .delete()
            .then(() => {
                const prevProducts = getState().products.list;
                const nextProducts = prevProducts.filter((product) => product.id !== id);
                dispatch(deleteProductAction(nextProducts));
            });
    };
};

export const fetchProducts = () => {
    return async (dispatch) => {
        productsRef
            .orderBy("updated_at", "desc")
            .get()
            .then((snapshots) => {
                const productList = [];
                snapshots.forEach((snapshot) => {
                    const product = snapshot.data();
                    ProductList.push(product);
                });
                dispatch(fetchProductsAction(productList));
            });
    };
};

export const saveProduct = (id, name, description, category, gender, price, images, sizes) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now();

        const data = {
            category: category,
            description: description,
            gender: gender,
            images: images,
            name: name,
            price: parseInt(price, 10),
            sizes: sizes,
            updated_ad: timestamp,
        };

        if (id === "") {
            const ref = productsRef.doc();
            id = ref.id;
            data.id = id;
            data.created_at = timestamp;
        }

        return productsRef
            .doc(id)
            .set(data, { merge: true })
            .then(() => {
                dispatch(push("/"));
            })
            .catch((error) => {
                throw new Error(error);
            });
    };
};
