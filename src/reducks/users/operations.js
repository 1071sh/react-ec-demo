import { db, auth, FirebaseTimestamp } from "../../firebase/index";
import { signOutAction, signInAction, fetchProductsInCartAction, fetchOrdersHistoryAction } from "./actions";
import { push } from "connected-react-router";

// import { initProductsAction } from "../products/actions";

const usersRef = db.collection("users");

export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = usersRef.doc(uid).collection("cart").doc();
        addedProduct["cartId"] = cartRef.id;
        await cartRef.set(addedProduct);
        dispatch(push("/cart"));
    };
};

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        usersRef
            .doc(uid)
            .collection("orders")
            .orderBy("updated_at", "desc")
            .get()
            .then((snapshots) => {
                snapshots.forEach((snapshot) => {
                    const data = snapshot.data();
                    list.push(data);
                });
                dispatch(fetchOrdersHistoryAction(list));
            });
    };
};

export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products));
    };
};

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged((user) => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((snapshot) => {
                        const data = snapshot.data();

                        dispatch(
                            signInAction({
                                customer_id: data.customer_id ? data.customer_id : "",
                                email: data.email,
                                isSignedIn: true,
                                role: data.role,
                                uid: user.uid,
                                username: data.username,
                            })
                        );
                    });
            } else {
                dispatch(push("/signin"));
            }
        });
    };
};

export const signUp = (username, email, password, confirmPassword) => {
    return async (dispatch) => {
        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            alert("必須項目が未入力です。");
            return false;
        }

        if (password !== confirmPassword) {
            alert("パスワードが一致しません。もう1度お試しください。");
            return false;
        }

        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;

                if (user) {
                    const uid = user.uid;
                    const timestamp = FirebaseTimestamp.now();

                    const userInitialData = {
                        customer_id: "",
                        created_at: timestamp,
                        email: email,
                        role: "customer",
                        uid: uid,
                        updated_at: timestamp,
                        username: username,
                    };

                    usersRef
                        .doc(uid)
                        .set(userInitialData)
                        .then(async () => {
                            dispatch(push("/"));
                        });
                }
            })
            .catch((error) => {
                alert("アカウント登録に失敗しました。もう1度お試しください。");
                throw new Error(error);
            });
    };
};

export const resetPassword = (email) => {
    return async (dispatch) => {
        if (email === "") {
            alert("必須項目が未入力です");
            return false;
        } else {
            return auth
                .sendPasswordResetEmail(email)
                .then(() => {
                    alert("入力されたアドレス宛にパスワードリセットのメールをお送りしましたのでご確認ください。");
                    dispatch(push("/signin"));
                })
                .catch(() => {
                    alert("登録されていないメールアドレスです。もう一度ご確認ください。");
                });
        }
    };
};

export const signIn = (email, password) => {
    return async (dispatch) => {
        if (email === "" || password === "") {
            alert("必須項目が未入力です");
            return false;
        }

        return auth.signInWithEmailAndPassword(email, password).then((result) => {
            const userState = result.user;

            const userId = userState.uid;

            return usersRef
                .doc(userId)
                .get()
                .then((snapshot) => {
                    const data = snapshot.data();

                    dispatch(
                        signInAction({
                            customer_id: data.customer_id ? data.customer_id : "",
                            email: data.email,
                            isSignedIn: true,
                            role: data.role,
                            uid: userId,
                            username: data.username,
                        })
                    );

                    dispatch(push("/"));
                });
        });
    };
};

export const signOut = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;

        // Delete products from the user's cart
        await usersRef
            .doc(uid)
            .collection("cart")
            .get()
            .then((snapshots) => {
                snapshots.forEach((snapshot) => {
                    usersRef.doc(uid).collection("cart").doc(snapshot.id).delete();
                });
            });

        auth.signOut()
            .then(() => {
                dispatch(signOutAction());
                dispatch(push("/signin"));
            })
            .catch(() => {
                throw new Error("ログアウトに失敗しました。");
            });
    };
};
