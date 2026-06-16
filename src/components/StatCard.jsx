const StatCard = ({ label, value, sub, colorClass }) => {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className={`value ${colorClass}`}>{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
};

export default StatCard;