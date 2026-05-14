const ProductCard = ({ emoji, badge, name, desc, price, category }) => {
  return (
    <div className="product-card" data-cat={category}>
      <div className="product-img">
        {emoji}
        {badge && <span className="product-badge">{badge}</span>}
      </div>
      <div className="product-info">
        <h4>{name}</h4>
        <div className="desc">{desc}</div>
        <div className="product-footer">
          <span className="product-price">{price}</span>
          <button className="btn-buy">Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;