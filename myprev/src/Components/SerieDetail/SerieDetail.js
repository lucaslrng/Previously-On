import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import './styleSerieDetail.css'

function SerieDetail(props) {

    function stringifyGenres(genres) {
        const output = Object.values(genres).reduce((prev, curr, i) => {
            return i === 0 ? prev + `${curr},` : prev + ` ${curr},`
        }, '')
        return output.slice(0, -1)
    }

    function translateStatus(status) {
        switch (status) {
            case 'Continuing':
                return "En cours"
                break;
            case 'Ended':
                return "Terminée"
                break;
            default:
                break;
        }
    }
    return (
        <>
            <Modal show={props.modalIsOpen} onHide={props.closeModal}>
                {props.serieDetail &&
                    <Modal.Header closeButton>
                        <Modal.Title>{props.serieDetail.title}</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    {props.serieDetail ?
                        <div className='serie-detail__top'>
                            {props.serieDetail.images.poster &&
                                <div className='serie-detail__frame'>
                                    <img className='serie-detail__image' src={props.serieDetail.images.poster} />
                                </div>
                            }
                            <div className='serie-detail__description'>
                                <p>{props.serieDetail.description}</p>
                            </div>
                        </div>

                        :
                        <Spinner />
                    }
                    {props.serieDetail &&
                        <>
                            <hr className='serie-detail__hr'></hr>
                            <div className='serie-detail__bottom'>
                                <div className='serie-detail__infos'>
                                    <p className='serie-detail__country'>Pays : {props.serieDetail.country}</p>
                                    <p className='serie-detail__genre'>Genre : {stringifyGenres(props.serieDetail.genres)}</p>
                                    <p className='serie-detail__status'>Status : {translateStatus(props.serieDetail.status)}</p>
                                </div>
                                <div className='serie-detail__eps'>
                                    <p className='serie-detail__seasons'>{props.serieDetail.seasons} saisons</p>
                                    <p className='serie-detail__seasons'>{props.serieDetail.episodes} épisodes</p>
                                    <p className='serie-detail__seasons'>Durée d'un épisode : {props.serieDetail.length}mins</p>

                                    <div className='serie-detail__rating'>
                                        <StarRatings
                                            rating={props.serieDetail.notes.mean}
                                            starRatedColor="blue"
                                            // changeRating={this.changeRating}
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension='20px'
                                            starSpacing='2px'
                                        />
                                        <span className='serie-detail__raters'>({props.serieDetail.notes.total})</span>
                                    </div>

                                </div>
                            </div>
                        </>
                    }
                </Modal.Body>

            </Modal>
        </>
    );
}

export default SerieDetail;