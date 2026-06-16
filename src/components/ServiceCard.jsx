const ServiceCard = ({ icon, title, description, price }) => {
  return (
    <div className="service-card fade-in">
      <div className="service-icon"><i className={`fas ${icon}`}></i></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="price-tag">{price}</div>
    </div>
  );
};

export default ServiceCard;