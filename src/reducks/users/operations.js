import { signInAction, signOutAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;

                db.collection("users")
                    .doc(uid)
                    .get()
                    .then((snapshot) => {
                        // const data = snapshot.data();
                        dispatch(
                            signInAction({
                                isSignedIn: true,
                                // role: data.role,
                                uid: uid,
                                // username: data.username,
                            })
                        );
                    });
            } else {
                dispatch(push("/signin"));
            }
        });
    };
};

export const resetPassword = (email) => {
    return async (dispatch) => {
        if (email === "") {
            alert("必須項目が未入力です");
            return false;
        } else {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert("入力されたアドレスにパスワードリセット用のメールをお送りました。");
                    dispatch(push("signin"));
                })
                .catch(() => {
                    alert("パスワードリセットに失敗しました。通信状態を確認してください。");
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
            const user = result.user;

            if (user) {
                const uid = user.uid;

                db.collection("users")
                    .doc(uid)
                    .get()
                    .then((snapshot) => {
                        // const data = snapshot.data();

                        dispatch(
                            signInAction({
                                isSignedIn: true,
                                // role: data.role,
                                uid: uid,
                                // username: data.username,
                            })
                        );

                        dispatch(push("/"));
                    });
            }
        });
    };
};

export const signUp = (username, email, password, confirmpassword) => {
    return async (dispatch) => {
        if (username === "" || email === "" || password === "" || confirmpassword === "") {
            alert("必須項目が未入力です");
            return false;
        }

        if (password !== confirmpassword) {
            alert("パスワードが一致しません。もう1度お試しください。");
            return false;
        }

        return auth.createUserWithEmailAndPassword(email, password).then((result) => {
            const user = result.user;

            if (user) {
                const uid = user.id;
                const timestamp = FirebaseTimestamp.now();

                const userInitialData = {
                    created_at: timestamp,
                    email: email,
                    role: "customer",
                    uid: "123",
                    updated_at: timestamp,
                    username: username,
                };

                db.collection("users")
                    .doc(uid)
                    .set(userInitialData)
                    .then(() => {
                        dispatch(push("/"));
                    });
            }
        });
    };
};

export const signOut = () => {
    return async (dispatch) => {
        auth.signOut().then(() => {
            dispatch(signOutAction());
            dispatch(push("/signin"));
        });
    };
};
