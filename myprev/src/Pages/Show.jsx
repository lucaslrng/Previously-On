import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Episode from '../Components/Episode/Episode';
import MyNav from '../Components/Navbar/navbar';
import { useSelector } from 'react-redux';
import './showStyle.css'

import CustomModal from '../Components/CustomModal/CustomModal';
import StarRatings from 'react-star-ratings';


function getSeenEpisodes(episodes, selectedSeasonUnseenEpisodes) {

    if (selectedSeasonUnseenEpisodes.length === 0) {
        return episodes
    }
    let output = []
    episodes.map(episode => {
        let test = false
        selectedSeasonUnseenEpisodes.map(unseenEpisode => {
            if (episode.code === unseenEpisode.code) {
                test = true
            }
        })
        if (!test) {
            output.push(episode)
        }
    })
    return output
}


function Show(props) {
    const { id } = useParams()
    const token = useSelector((state) => {
        if (state.token != null) {
            return state.token
        }
    })
    const [show, setShow] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([])

    const [filteredEpisodes, setFilteredEpisodes] = useState([])
    const [isOpen ,setIsOpen] = useState(false);
    const [details, setDetails] = useState([])
    const [epImg, setEpImg] = useState()
    const [note, setNote] = useState();
    const [totalNote, setTotalNote] = useState();

    function closeModal() {
        setIsOpen(false);
    }


    function handleClick(e, id) {
        setIsOpen(true);
        axios.get(`https://api.betaseries.com/episodes/display?id=${id}`,
            { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
            .then(res => {
                setNote(res.data.episode.note.mean)
                setTotalNote(res.data.episode.note.total)
                setDetails(res.data.episode)
            })
            .catch(err => console.log(err))
        axios.get(`https://api.betaseries.com/pictures/episodes?id=${id}`,
            { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
            .then(res => {
                // console.log(res)
                setEpImg(res.request.responseURL)
            })
            .catch(err => console.log(err))
    }

    const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState([])
    const [seenEpisodes, setSeenEpisodes] = useState([])
    const [allUnseenEpisodes, setAllUnseenEpisodes] = useState(null)

    useEffect(() => {
        if (!show) {
            axios.get(`https://api.betaseries.com/shows/display?id=${id}`,
                { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
                .then(res => {
                    setShow(res.data.show)
                })
                .catch(err => console.log(err))
        }
    }, [show])

    useEffect(() => {
        if (episodes.length === 0) {// get tous les eps de la série
            axios.get(`https://api.betaseries.com/shows/episodes?id=${id}`,
                { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
                .then(res => {
                    setEpisodes(res.data.episodes)
                    const eps = filterEpisodes(res.data.episodes, selectedSeason)
                    setCurrentSeasonEpisodes(eps)
                })
                .catch(err => console.log(err))
        }
    }, [episodes])

    useEffect(() => { //get les episodes pas vu
        if (!allUnseenEpisodes) {
            assignUnseenEpisodes()
        } else {
            assignSeenEpisodes(currentSeasonEpisodes, selectedSeason, allUnseenEpisodes)
        }
    }, [allUnseenEpisodes])

    const fetchUnseenEpisodes = async function () {
        const response = await axios.get(`https://api.betaseries.com/episodes/list?showId=${id}&token=${token}`,
            { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
        if (response.status === 200) {
            if (response.data.shows.length !== 0) {
                return response.data.shows[0].unseen
            } else {
                return []
            }
        }
    }
    const assignUnseenEpisodes = async function () {
        const unseenEpisodes = await fetchUnseenEpisodes()
        setAllUnseenEpisodes(unseenEpisodes)
    }
    function assignSeenEpisodes(currentSeasonEpisodes, selectedSeason, allUnseenEpisodes) {
        const selectedSeasonUnseenEpisodes = allUnseenEpisodes.filter(ep => ep.season === selectedSeason)
        const seenEpisodes = getSeenEpisodes(currentSeasonEpisodes, selectedSeasonUnseenEpisodes)
        setSeenEpisodes(seenEpisodes)
    }
    async function handleSeasonClick(episodes, index) {
        setSelectedSeason(index)
        const eps = filterEpisodes(episodes, index)
        setCurrentSeasonEpisodes(eps)
        const unseenEpisodes = await fetchUnseenEpisodes()
        setAllUnseenEpisodes(unseenEpisodes)
        assignSeenEpisodes(eps, index, unseenEpisodes)
    }
    function generateSeasons() {
        let output = []

        for (let index = 1; index <= show.seasons; index++) {
            output[index - 1] = (<div key={`season${id}-${index}`} className={selectedSeason === index ? "show__season show__season--current" : "show__season"} onClick={() => handleSeasonClick(episodes, index)}>
                <span>{`Saison ${index}`}</span>
            </div>)
        }
        return output
    }
    function filterEpisodes(episodes, selectedSeason) {
        return episodes.filter(ep => ep.season === selectedSeason)
    }
    function isEpisodeSeen(testedEpisode, seenEpisodes) {
        let test = false
        seenEpisodes.map(ep => {
            if (ep.code === testedEpisode.code) {
                test = true
            }
        })
        return test
    }
    async function addEpisodeToSeen(episode, alreadySeenEpisodes, currentSeasonEpisodes, isEpisodeSeen, addPrecedent = false) {
        if (addPrecedent) {
            let output = []
            let stopAdding = false
            for (let [key, ep] of Object.entries(currentSeasonEpisodes)) {
                if (!isEpisodeSeen(episode, alreadySeenEpisodes)) {
                    if (!stopAdding) {
                        output.push(ep)
                    }
                }
                if (episode.code === ep.code) {
                    stopAdding = true
                }
            }
            alreadySeenEpisodes.map(ep => {
                if (!isEpisodeSeen(ep, output)) {
                    output.push(ep)
                }
            })
            output = sortEpisodes(output)
            setSeenEpisodes(output)
        } else {
            setSeenEpisodes(state => {
                let episodes = [...state, episode]
                const output = sortEpisodes(episodes)
                return output
            })
        }
    }
    function sortEpisodes(episodes) {
        return episodes.sort((a, b) => {
            if (a > b) {
                return -1;
            }
            if (b > a) {
                return 1;
            }
            return 0;
        })
    }
    async function removeEpisodeToSeen(episode) {

        setSeenEpisodes(state => {
            return state.filter(elt => elt.code !== episode.code)
        })
    }

    return (
        <>
            <MyNav />
            <CustomModal
            openModal={handleClick}
            closeModal={closeModal}
            modalIsOpen={isOpen}
            title={details.title}
            >
                <div className='detailsImg'><img src={epImg} alt="" /></div>
                
                <p>Date: {details.date}</p>
                <StarRatings
                    rating={note}
                    starRatedColor="blue"
                    numberOfStars={5}
                    name='rating'
                    starDimension='20px'
                    starSpacing='2px'
                />
                <span className='serie-detail__raters'>({totalNote})</span>
                <div className='test'><p>{details.description}</p></div>
                
            </CustomModal>
            {show ?
                <div className='show'>
                    <div className='show__head' >
                        <h1 className='show__title' >{show.title}</h1>
                        {/* <img src={show.images.poster} alt="" className="show__frame" /> */}
                    </div>
                    <div className='show__body'>
                        <div className="show__seasons">
                            {generateSeasons()}
                        </div>
                        {currentSeasonEpisodes &&
                            <div className="show__episodes">
                                {currentSeasonEpisodes &&
                                    currentSeasonEpisodes.map((ep, i) => <Episode onClick={handleClick} removeEpisodeToSeen={removeEpisodeToSeen} isEpisodeSeen={isEpisodeSeen} currentSeasonEpisodes={currentSeasonEpisodes} seenEpisodes={seenEpisodes} addEpisodeToSeen={addEpisodeToSeen} seen={isEpisodeSeen(ep, seenEpisodes)} key={`show-${i}`} index={i} episode={ep} />)
                                }
                            </div>
                        }
                    </div>
                </div>
                :
                <Spinner />
            }

        </>
    );
}

export default Show;