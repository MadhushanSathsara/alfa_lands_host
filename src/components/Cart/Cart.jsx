import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, propertiesList, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const deliveryFee = 0; // Assuming there's no delivery fee for land
  const subtotal = getTotalCartAmount();
  const total = subtotal + deliveryFee;

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Property Name</p>
          <p>Price</p>
          <p>Location</p>
          <p>Remove</p>
        </div>
        <hr />
        {propertiesList.map((item) => {
          const quantity = cartItems[item.id];
          if (quantity > 0) {
            return (
              <div key={item.id} className="cart-items-item">
                <div className="cart-items-content">
                  <img className="cart-item-img" src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <p>{item.location}</p>
                  <p onClick={() => removeFromCart(item.id)} className="remove" aria-label="Remove item">Remove</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
