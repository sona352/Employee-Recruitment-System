import Cookies from 'js-cookie';
import React, { useState } from "react";
import { AiOutlinePoweroff, AiOutlineEdit, AiFillSchedule, AiOutlineFileAdd, AiOutlineFileDone } from "react-icons/ai";
import { BsPersonSquare, BsFileText } from "react-icons/bs";
import { MdHome, MdMenu} from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link, useHistory } from "react-router-dom";

const Nav = props => {
  let history = useHistory();

  const [state, setState] = useState({
    Collapsed: true,
  });
  function collapse() {
    setState({ ...state, Collapsed: !Collapsed });
  }
  function logout() {
    Cookies.remove('userID', { path: '/' });
    Cookies.remove('firstname', { path: '/' });
    Cookies.remove('lastname', { path: '/' });
    history.push({
      pathname: `/`,
    });
  }
  const { Collapsed } = state;
  return (
    <ProSidebar
      style={{ color: 'white',backgroundColor: '#2b3470' }}
      collapsed={Collapsed}
      collapsedWidth="81px"
      width="220px"
    >
      <Menu>
        <MenuItem>
          <MdMenu
            onClick={() => collapse()}
            style={{ marginLeft: "2px", marginRight: "1em" }}
            size={30}
          ></MdMenu>
        </MenuItem>
        <hr></hr>
        <MenuItem>
          <Link style={{ color: 'white' }} to="/hrDashboard">
            <MdHome
              size={28}
              style={{ marginLeft: "2px", marginRight: "1em" }}
            ></MdHome>
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link style={{ color: 'white' }} to="/AddJob">
            <AiOutlineFileAdd
              size={26}
              style={{ marginLeft: "2px", marginRight: "1em" }}
            ></AiOutlineFileAdd>
            Add Job Opening{" "}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link style={{ color: 'white' }} to="/EditJob">
            <AiOutlineEdit
              size={26}
              style={{ marginLeft: "2px", marginRight: "1em" }}
            ></AiOutlineEdit>
            Edit Job Opening{" "}
          </Link>
        </MenuItem>

        <MenuItem>
          <Link style={{ color: 'white' }} to="/ViewApplications">
          <RiProfileLine
            onClick={() => collapse()}
            size={26}
            style={{ marginLeft: "2px", marginRight: "1em" }}
          ></RiProfileLine>
          View Applications
          </Link>
        </MenuItem>

        <hr></hr>
        <MenuItem onClick={() => logout()}>
          <AiOutlinePoweroff
            size={23}
            style={{ marginLeft: "2px", marginRight: "1em" }}
          ></AiOutlinePoweroff>
            Logout
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Nav;
