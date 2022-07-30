import React from "react";
import PropTypes from "prop-types";

//Style
import "./Loader.css";

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      style={
        fullScreen
          ? {
              backgroundColor: "#322f36",
              position: "absolute",
              zIndex: 102,
            }
          : {}
      }
      id="preloader"
    >
      <div id="loader"></div>
    </div>
  );
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Loader;
