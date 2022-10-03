import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux'
import { setToken } from '../../app/features/tokenSlice';
import { setUser, setAvatar } from '../../app/features/userSlice';
import CustomModal from '../CustomModal/CustomModal';
import { useNavigate } from 'react-router-dom';
import './styleLogout.css'

function Logout(props) {
    const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    function closeModal() {
        props.setIsOpen(false);
    }
    function handleYesBtnClick() {
        dispatch(setUser(null))
        dispatch(setToken(''))
        closeModal()
        navigate('/')
    }
    function handleNoBtnClick() {
        closeModal()
    }
      
    return (
        <CustomModal
            openModal={props.openModal}
            closeModal={closeModal}
            modalIsOpen={props.modalIsOpen}
            title="Déconnexion"
            errorMessage={errorMessage}
        >
            <div className='modal-logout'>
                <p>Voulez-vous vraiment vous déconnecter ?</p>
                <div className='modal-logout__btns'>
                    <Button className="modal-logout__btn" onClick={handleYesBtnClick}>Oui</Button>
                    <Button className="modal-logout__btn" onClick={handleNoBtnClick}>Non</Button>
                </div>
            </div>
        </CustomModal>
    );
}

export default Logout;