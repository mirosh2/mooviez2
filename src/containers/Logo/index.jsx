import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Logo.css';

class Logo extends Component {
  render() {
    return (
      <div className="logo">
        <Link to="/"><img src="/img/logo.png" alt="logo"/></Link>
        <span>Mooviez</span>
      </div>
    );
  }
}

export default Logo;