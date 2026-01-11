import React, { useEffect } from "react";
import "./childProfile.scss";
import type { ChildProfileProps } from "../../Types/childProfile.model";


const ChildProfile: React.FC<ChildProfileProps> = ({
  title = "Child Profile",
  subtitle = "Home Care Management System",

  photoUrl,
  photoAlt = "Child Photo",
  photoEmoji = "👦",

  fullName,
  dobText,
  childId,
  admissionDate,

  homeName,
  homeHref,

  medicalConditions,

  viewHomeHref,
  viewHistoryHref,
  addCommentHref,

  caretakerName,
  caretakerHref,
  caretakerPhone,
  caretakerEmailText,
  caretakerIconEmoji = "👩‍⚕️",

  recentHistory,
  caretakerComments,
}) => {
  useEffect(() => {
    // Mimic the original load-in animation (detail/history/comment items)
    const items = document.querySelectorAll(
      ".detail-item, .history-item, .comment-item"
    );

    items.forEach((item, index) => {
      const el = item as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";

      window.setTimeout(() => {
        el.style.transition = "opacity 0.5s, transform 0.5s";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 50);
    });
  }, []);

  return (
    <div className="child-profile-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="photo-container">
            {photoUrl ? (
              <img src={photoUrl} alt={photoAlt} className="profile-photo" />
            ) : (
              <div className="photo-placeholder" aria-label="Child avatar">
                {photoEmoji}
              </div>
            )}
          </div>

          <div className="details-container">
            <div className="detail-item">
              <div className="detail-label">Full Name</div>
              <div className="detail-value">{fullName}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Date of Birth</div>
              <div className="detail-value">{dobText}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Child ID</div>
              <div className="detail-value">{childId}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Admission Date</div>
              <div className="detail-value">{admissionDate}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Home Assignment</div>
              <div className="detail-value">
                <a href={homeHref} className="entity-link">
                  {homeName}
                </a>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Medical Conditions</div>
              <div className="detail-value">{medicalConditions}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <a href={viewHomeHref} className="link-button">
            🏠 View Home Details
          </a>
          <a href={viewHistoryHref} className="link-button">
            📋 View Full History
          </a>
          <a href={addCommentHref} className="link-button">
            💬 Add Comment
          </a>
        </div>

        {/* Caretaker Section */}
        <div className="caretaker-section">
          <div className="section-title">Assigned Caretaker</div>
          <div className="caretaker-info">
            <div className="caretaker-icon" aria-hidden="true">
              {caretakerIconEmoji}
            </div>
            <div>
              <div className="detail-label">Primary Caretaker</div>
              <div className="detail-value">
                <a href={caretakerHref} className="entity-link">
                  {caretakerName}
                </a>
              </div>
              <div className="caretaker-meta">
                Phone: {caretakerPhone} | Email: {caretakerEmailText}
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="history-section">
          <div className="section-title">Recent History</div>

          {recentHistory.map((h, idx) => (
            <div className="history-item" key={`${h.date}-${idx}`}>
              <div className="history-date">{h.date}</div>
              <div>{h.text}</div>
            </div>
          ))}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <div className="section-title">Caretaker Comments</div>

          {caretakerComments.map((c, idx) => (
            <div className="comment-item" key={`${c.dateTime}-${idx}`}>
              <div className="comment-date">{c.dateTime}</div>
              <div className="comment-author">
                <a href={c.authorHref} className="entity-link">
                  {c.authorName}
                </a>{" "}
                {c.authorMeta ? <span>{c.authorMeta}</span> : null}
              </div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
