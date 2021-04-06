import React from "react";
import { getUserId, getUsername } from "../reducks/users/selectors";
import { useSelector } from "react-redux";

const Home = () => {
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    const username = getUsername(selector);

    return (
        <div>
            <h2>Home</h2>
            <div>ユーザーID:{uid}</div>
            <div>ユーザー名:{username}</div>
        </div>
    );
};
export default Home;
