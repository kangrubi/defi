import React from "react";
import farmer from "../farmer.png";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={farmer}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        &nbsp; DApp Token Farm &nbsp;
        {account}
      </a>
    </nav>
  );
};

export default Navbar;
