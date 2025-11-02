import React from "react";
import PropTypes from "prop-types";

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-2 hover:scale-105 transition-transform duration-300">
      <img
        src={`/icons/${TechStackIcon}`}
        alt={Language}
        className="w-12 h-12 object-contain mb-2"
      />
      <span className="text-slate-200 text-sm">{Language}</span>
    </div>
  );
};

TechStackIcon.propTypes = {
  TechStackIcon: PropTypes.string.isRequired,
  Language: PropTypes.string.isRequired,
};

export default TechStackIcon;
