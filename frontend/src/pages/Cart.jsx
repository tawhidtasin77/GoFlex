import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, addToCart } from "../redux/cartSlice";
import "../styles/cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Remove product from cart
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Update product quantity
  const handleUpdateQuantity = (item, quantity) => {
    if (quantity < 1) {
      return;
    }

    dispatch(
      addToCart({
        ...item,
        quantity,
      })
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Go to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>

          <Link to="/shop">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items">

            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="cart-item"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                {/* Product Information */}
                <div className="cart-item-details">

                  <h4>{item.name}</h4>

                  <p>
                    ৳{item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="qty-controls">

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(item.productId)
                    }
                    className="btn-remove"
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))}

          </div>

          {/* Cart Summary */}
          <div className="cart-summary">

            <h3>
              Total: ৳{totalPrice.toFixed(2)}
            </h3>

            <button
              type="button"
              onClick={handleCheckout}
              className="btn btn-checkout"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;