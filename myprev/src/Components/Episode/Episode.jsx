import React from 'react';
import { Button, Card } from 'react-bootstrap'
import check from '../../Assets/Images/checkb.png'
import './styleEpisode.css'
import OverlayButton from '../OverlayButton/OverlayButton';

function Episode(props) {
    const [popupVisible, setPopupVisible] = React.useState(false);

    return (
        <div className='episode' key={`filteredEp${props.index}`}>

            {props.episode.user.seen && <div className='episode__overlay'></div>}
            {
                <Card onClick={(e) => props.onClick(e, props.episode.id)}>
                    <Card.Header as="h5">
                        <div className="title">{props.episode.code}</div>
                        <div className="bt">
                        {props.episode.user.seen  ?
                            <button className='favbtn'><img src={check} alt="" /></button>
                            :
                            <div className="episode__btns">
                                <OverlayButton removeEpisodeToSeen={props.removeEpisodeToSeen} isEpisodeSeen={props.isEpisodeSeen} currentSeasonEpisodes={props.currentSeasonEpisodes} seenEpisodes={props.seenEpisodes} seen={props.seen} addEpisodeToSeen={props.addEpisodeToSeen} episode={props.episode} id={props.episode.id} />
                            </div>

                        }
                        </div>
                        
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{props.episode.title}</Card.Title>
                        <Card.Text>
                            {props.episode.description}
                        </Card.Text>
                        
                    </Card.Body>
                </Card>
            }
        </div>)
}

export default Episode;
