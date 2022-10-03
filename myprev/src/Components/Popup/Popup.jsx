import React from 'react';
import { Button } from 'react-bootstrap';
import './stylePopup.css';
function Popup(props) {
    console.log("popup");
    return (
        <div className={props.visible ? 'popup popup--visible' : 'popup'}>
            <span className="popup__text">{props.text}</span>
            <div className="popup__btns">
                <Button className="popup__btn">Oui</Button>
                <Button className="popup__btn">Non</Button>
            </div>
        </div>
    );
}

export default Popup;