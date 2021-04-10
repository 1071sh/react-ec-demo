import { List, makeStyles } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartListItem } from "../components/Products";
import { PrimaryButton, GreyButton } from "../components/UIkit";
import { getProductsInCart } from "../reducks/users/selectors";
import { push } from "connected-react-router";

const useStyles = makeStyles({
    root: {
        margin: "0 auto",
        maxWidth: 512,
        width: "100%",
    },
});

const CartList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const productsInCart = getProductsInCart(selector);

    const gotToOrder = useCallback(() => {
        dispatch(push("/order/confirm"));
    }, []);

    const backToHome = useCallback(() => {
        dispatch(push("/"));
    }, []);

    return (
        <section className="c-section-wrapin">
            <h2 className="u-text-headline">ショッピングカート</h2>
            <List className={classes.root}>
                {productsInCart.length &&
                    productsInCart.map((product) => <CartListItem key={product.cartId} product={product} />)}
            </List>
            <div className="module-spacer--medium" />
            <div className="p-grid__column">
                <PrimaryButton label={"レジへ進む"} onClick={gotToOrder} />
                <div className="module-spacer--extra-extra-small" />
                <GreyButton label={"ショッピングを続ける"} onClick={backToHome} />
            </div>
        </section>
    );
};

export default CartList;
