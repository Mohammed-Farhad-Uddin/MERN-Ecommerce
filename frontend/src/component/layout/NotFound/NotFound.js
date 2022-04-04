import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;