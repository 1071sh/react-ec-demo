import React, { useCallback, useState } from "react";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { signUp } from "../reducks/users/operations";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

const SignUp = () => {
    const dispatch = useDispatch();

    const [username, SetUsername] = useState(""),
        [email, SetEmail] = useState(""),
        [password, SetPassword] = useState(""),
        [confirmPassword, SetConfirmPassword] = useState("");

    const inputUsername = useCallback(
        (event) => {
            SetUsername(event.target.value);
        },
        [SetUsername]
    );
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
    const inputConfirmPassword = useCallback(
        (event) => {
            SetConfirmPassword(event.target.value);
        },
        [SetConfirmPassword]
    );

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">アカウント登録</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true}
                label={"ユーザー名"}
                margin="dense"
                multiline={false}
                required={true}
                rows={1}
                value={username}
                type={"text"}
                onChange={inputUsername}
            />
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
            <TextInput
                fullWidth={true}
                label={"パスワード（確認用）"}
                margin="dense"
                multiline={false}
                required={true}
                rows={1}
                value={confirmPassword}
                type={"password"}
                onChange={inputConfirmPassword}
            />
            <div className="module-spacer--medium" />
            <div className="center">
                <PrimaryButton
                    label={"アカウントを登録する"}
                    onClick={() => dispatch(signUp(username, email, password, confirmPassword))}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push("/signin"))}>アカウント登録をお持ちの方はこちら</p>
            </div>
        </div>
    );
};

export default SignUp;
