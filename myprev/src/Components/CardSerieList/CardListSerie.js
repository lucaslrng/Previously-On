import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './cardlistserie.css'
import fav from '../../Assets/Images/vaf.png'
import check from '../../Assets/Images/checkb.png'
import del from '../../Assets/Images/croix.png'
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import unavailable from '../../Assets/Images/unavailable.jpg'



// https://api.betaseries.com/shows/show?id=${idSeries}&token=${token}  ADD À LA LISTE
// https://api.betaseries.com/shows/show?id=${idSeries}&token=${token}  DEL DE LA LISTE

// https://api.betaseries.com/shows/favorite?id=${idSeries}&token=${token}  ADD AUX FAV
// https://api.betaseries.com/shows/favorite?id=${idSeries}&token=${token}  DEL DES FAV

function CardListSerie(props) {

    const token = useSelector((state) => {
        if (state.token != null) {
            return state.token
        }
    });
    const navigate = useNavigate()
    const addFav = (e) => {
        e.stopPropagation()
        const idSeries = props.id

        axios({
            method: "POST",
            url: `https://api.betaseries.com/shows/show?id=${idSeries}&token=${token}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
            }
            ).catch(err => console.log(err))
    }
    const delFav = (e) => {
        e.stopPropagation()
        const idSeries = props.id
        axios({
            method: "DELETE",
            url: `https://api.betaseries.com/shows/show?id=${idSeries}&token=${token}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                props.setShowList((state) => {
                    return state.filter(e => e.id !== props.id)
                })
            }).catch(err => console.log(err))
    }

    function handlePictureClick() {
        props.openModal()
        axios.get(`https://api.betaseries.com/shows/display?id=${props.id}`,
            { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
            .then(res => {
                console.log(res);
                props.setSerieDetail(res.data.show)
            })
            .catch(err => console.log(err))
    }


    function handleCardClick() {
        if (props.openModal) {
            handlePictureClick()
        } else if (props.redirect) {
            navigate(`/show/${props.id}`)
        }
    }
    function addDefaultSrc(e) {
        e.target.onerror = null; // prevents looping
        e.target.src = unavailable
    }
    return (
        <>
            <Card className={props.id ? 'card-serie card-serie--pointer' : 'card-serie'} onClick={handleCardClick}>
                <Card.Body className='card-serie__body'>
                    <Card.Text className='card-serie__title'>
                        {props.title}
                    </Card.Text>
                    {props.favoriteBtn &&
                        <button className='favbtn' onClick={addFav} ><img src={fav} alt="" /></button>
                    }
                    {props.delBtn &&
                        <button className='favbtn' onClick={delFav} ><img src={del} alt="" /></button>
                    }
                    {props.checkBtn &&
                        <button className='favbtn'><img src={check} alt="" /></button>
                    }
                    {props.link &&
                        <a href={props.link} className='card-serie__link' target="blank">Voir la news</a>
                    }
                </Card.Body>
                {props.imgUrl ?
                    <Card.Img
                        className='card-serie__img'
                        onError={(e) => addDefaultSrc(e)}
                        variant="bottom"
                        src={props.imgUrl}
                    />
                    :
                    <Card.Img
                        className='card-serie__img card-serie__img--unavailable'
                        onError={(e) => addDefaultSrc(e)}
                        variant="bottom"
                        src={unavailable}
                    />
                }

            </Card>
        </>

    );
}

export default CardListSerie;