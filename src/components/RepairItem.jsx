const RepairItem = ({ icon, device, description, date, status, statusClass }) => {
  return (
    <div className="repair-item">
      <div className="device-icon">{icon}</div>
      <div className="device-info">
        <h4>{device}</h4>
        <p>{description}</p>
      </div>
      <div className="repair-date">{date}</div>
      <span className={`status-badge ${statusClass}`}>{status}</span>
    </div>
  );
};

export default RepairItem;