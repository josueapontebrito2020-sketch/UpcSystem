const TechCard = ({ avatar, name, role, bio, skills, rating }) => {
  return (
    /* La clase fade-in se activa mediante el Observer en Home.jsx */
    <div className="tech-card fade-in">
      <div className="tech-avatar">
        {}
        <span>{avatar}</span>
      </div>
      
      <h3>{name}</h3>
      
      {}
      <div className="role">{role}</div>
      
      <p className="bio">{bio}</p>
      
      <div className="tech-skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="rating">
        {}
        {rating}
      </div>
    </div>
  );
};

export default TechCard;