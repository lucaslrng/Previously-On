import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import CustomModal from '../CustomModal/CustomModal';
import './styleLogin.css'
import md5 from 'md5';
import axios from 'axios';
import { useDispatch } from 'react-redux'
// import { setToken } from '../../app/features/tokenSlice';
import { setUser, setAvatar, setToken } from '../../app/features/userSlice';

function Login(props) {
    const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState(null)
    const dispatch = useDispatch()

    function closeModal() {
        props.setIsOpen(false);
    }
    function handleLoginChange(e) {
        setLogin(e.target.value)
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value)
    }
    function handleSubmitClick(e) {
        const hashedPassword = md5(password)
        const body = {
            login: login,
            password: hashedPassword
        }
        axios.post('https://api.betaseries.com/members/auth', body, { headers: {"X-BetaSeries-Key": process.env.REACT_APP_API_KEY}})
        .then(response => {
            const id = response.data.user.id
            dispatch(setUser(response.data.user))
            dispatch(setToken(response.data.token))
            setErrorMessage(null)
            setLogin('')
            setPassword('')
            closeModal()
            axios.get(`https://api.betaseries.com/members/infos?id=${id}`, { headers: {"X-BetaSeries-Key": process.env.REACT_APP_API_KEY}})
                .then(response => {
                    dispatch(setAvatar(response.data.member.avatar))
                })
        })
        .catch(error => {
            setErrorMessage("Informations incorrectes")
        })

    }
    return (
        <CustomModal
            openModal={props.openModal}
            closeModal={closeModal}
            modalIsOpen={props.modalIsOpen}
            title="Connexion"
            bottomButton={<Button className="modal__bottom-btn" variant="secondary" onClick={handleSubmitClick} type='submit'>Se connecter</Button>}
            errorMessage={errorMessage}
        >
            <Form>
                <Form.Group className="mb-3">
                <Form.Label htmlFor='login'>
                    Identifiant (login ou email) : 
                </Form.Label>
                <Form.Control
                        type="text"
                        value={login}
                        onChange={handleLoginChange}
                        id="login" 
                        />
                </Form.Group>
                <Form.Group >
                <Form.Label htmlFor='password'>
                    Mot de passe : 
                </Form.Label>
                <Form.Control
                        className='mb-3'
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        id="password" 
                        />
                </Form.Group>
            </Form>
        </CustomModal>
    );
}

export default Login;