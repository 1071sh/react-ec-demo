import React, { useCallback, useState } from "react";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { signIn } from "../reducks/users/operations";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

const SignIn = () => {
    const dispatch = useDispatch();

    const [email, SetEmail] = useState(""),
        [password, SetPassword] = useState("");

    const inputEmail = useCallback(
        (event) => {
            SetEmail(event.target.value);
        },
        [SetEmail]
    );
    const inputPassword = useCallback(
        (event) => {
            SetPassword(event.target.value);
        },
        [SetPassword]
    );

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">サインイン</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true}
                label={"メールアドレス"}
                margin="dense"
                multiline={false}
                required={true}
                rows={1}
                value={email}
                type={"email"}
                onChange={inputEmail}
            />
            <TextInput
                fullWidth={true}
                label={"パスワード"}
                margin="dense"
                multiline={false}
                required={true}
                rows={1}
                value={password}
                type={"password"}
                onChange={inputPassword}
            />
            <div className="module-spacer--medium" />
            <div className="center">
                <PrimaryButton label={"Sign In"} onClick={() => dispatch(signIn(email, password))} />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push("/signup"))}>アカウント登録をしてない方はこちら</p>
                <p onClick={() => dispatch(push("/signin/reset"))}>パスワードを忘れた方はこちら</p>
            </div>
        </div>
    );
};

export default SignIn;
