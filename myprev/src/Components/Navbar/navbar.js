import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import nolog from '../../Assets/Images/nologb.png';
import log from '../../Assets/Images/logb.png';
import film from '../../Assets/Images/filmblan.png';
import fav from '../../Assets/Images/vaf.png'
import friend from '../../Assets/Images/friend.png'
import './stylenav.css';
import Login from "../Login/Login";
import { useSelector } from "react-redux";
import Logout from "../Logout/Logout";
import { Link } from "react-router-dom";


const MyNav = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const user = useSelector((state) => {
    if (state.user != null) {
      return state.user
    }
  })

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <Navbar className="navbar">
        <Container>
          <Link to="/" className="logo">5 MINUTES</Link>
          <Nav className="me-auto">
            {user &&
              <>
                <Link to="/MySeries" className="link" ><img  className="navbar__image" src={fav} />Mes Series</Link>
                <Link to="/MyFriends" className="link" ><img  className="navbar__image" src={friend} />Mes Amis</Link>
              </>
            }
            <Link to="/Catalogue" className="link" ><img  className="navbar__image" src={film} />Catalogue</Link>
          </Nav>
          {user ?
            user.avatar ?
              <Nav className="de-flex navbar__wrapper" onClick={openModal}>
                <Nav className="link" ><img src={user.avatar} className="navbar__image" />Deconnexion</Nav>
              </Nav>
              :
              <Nav className="de-flex navbar__wrapper" onClick={openModal}>
                <Nav className="link" ><img src={nolog} />Deconnexion</Nav>
              </Nav>
            :
            <Nav className="de-flex navbar__wrapper" onClick={openModal}>
              <Nav className="link"><img src={nolog}  />Connexion</Nav>
            </Nav>
          }
        </Container>
      </Navbar>
      {user ?
      <Logout
        openModal={openModal}
        setIsOpen={setIsOpen}
        modalIsOpen={modalIsOpen}
      />
      :
      <Login
      openModal={openModal}
      setIsOpen={setIsOpen}
      modalIsOpen={modalIsOpen}
    /> 
      }
    
    </>
  )
}
export default MyNav;