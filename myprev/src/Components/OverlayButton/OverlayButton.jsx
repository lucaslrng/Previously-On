import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import check from '../../Assets/Images/checkb.png'
import './styleOverlayButton.css'
import { useSelector } from "react-redux";
import axios from 'axios';
import del from '../../Assets/Images/croix.png'


function OverlayButton(props) {
    const token = useSelector((state) => {
        if (state.token != null) {
            return state.token
        }
    })

    const renderTooltip = (props) => (
        <Tooltip onClick={(e) => handleAddClick(e, true)} className='blue-tooltip' id="button-tooltip" {...props}>
            <span className='tooltip__text'>Ajouter les épisodes précédents</span>
        </Tooltip>
    );

    function handleAddClick(e) {
        e.stopPropagation()
        let bulk = false
        const targetClassList = e.target.classList
        if (targetClassList.contains('tooltip__text') || targetClassList.contains('tooltip-inner')) {
            bulk = true
        }
        const body = {
            id: props.episode.id,
            bulk: bulk
        }
        axios.post(`https://api.betaseries.com/episodes/watched?token=${token}`, body, { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
            .then(response => {
                props.addEpisodeToSeen(response.data.episode, props.seenEpisodes, props.currentSeasonEpisodes, props.isEpisodeSeen, bulk)
            })
            .catch(error => {

            })

    }

    function handleRemoveClick(e) {
        e.stopPropagation()
        axios.delete(`https://api.betaseries.com/episodes/watched?token=${token}&key=${process.env.REACT_APP_API_KEY}&id=${props.episode.id}`)
            .then(response => {
                props.removeEpisodeToSeen(response.data.episode)
            })
            .catch(error => {

            })
    }
    return (
        <>
            {props.seen ?
                <button onClick={(e) => handleRemoveClick(e, false)} className='favbtn favbtn--bg'><img className='favbtn__img' src={del} /></button>
                :
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 2000 }}
                    overlay={renderTooltip}
                >
                    <button onClick={(e) => handleAddClick(e, false)} className='favbtn favbtn--bg'><img className='favbtn__img' src={check} /></button>
                </OverlayTrigger>
            }
        </>
    )
}

export default OverlayButton;