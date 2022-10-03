import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './stylecat.css';
import axios from 'axios';
import Container from "react-bootstrap/esm/Container";
import CardListSerie from '../CardSerieList/CardListSerie';
import { Spinner } from 'react-bootstrap';
import MyNav from "../Navbar/navbar";
import SerieDetail from "../SerieDetail/SerieDetail";
import arrow from '../../Assets/Images/arrow.png'

let controller
const Cat = () => {
    const [show, setShow] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [filteredshow, setFilteredShow] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [serieDetail, setSerieDetail] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
   console.log(page);
    useEffect(() => {
        if (filterList.length === 0) {
            axios.get('https://api.betaseries.com/shows/genres',
                { headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY } })
                .then(res => {
                    setFilterList({ 'Category': 'Catégorie', ...res.data.genres })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [filterList])

    const filtershow = (e) => {
        const filter = e.target.value
        if (filter != '') {
            const filteredShow = show.filter(value => {

                return Object.values(value.genres).includes(filter)
            });
            setFilteredShow(filteredShow)
        }
    }
    function handleChange(e) {
        setPage(1)
        setSelectedOption(e.target.value)
        filtershow(e)
    }
    const searchShow = (currentPage) => {
        const encodedSearchTitle = encodeURI(search)
        if (search.length === 0) {
            setShow([])
        } else {
            setFilteredShow('')
            if (controller) {
                controller.abort()
            }
            setSelectedOption('Category')
            setIsLoading(true)
            controller = new AbortController();
            axios.get(`https://api.betaseries.com/shows/search?nbpp=15&title=${encodedSearchTitle}&page=${currentPage}`,
                {
                    headers: { "X-BetaSeries-Key": process.env.REACT_APP_API_KEY },
                    signal: controller.signal
                })
                .then(res => {
                    console.log(res);
                    setShow(res.data.shows);
                    setIsLoading(false)
                }
                ).catch(err => {
                    console.log(err)
                    setIsLoading(false)
                })
        }
    }

    async function handlePagination(direction) {
        let count = page
        if (direction === 'next') {
            count += 1
        } else if (direction === 'prev') {
            count -= 1
        }
        searchShow(count)
        setPage(count)
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }
    function handleSearchChange(e) {
        setPage(1)
        setSearch(e.target.value)
        searchShow(1)
    }
    function GenerateShow() {
        if (show.length > 0) {
            if (filteredshow) {
                if (isLoading) {
                    return (
                        <div className='wrapper--spinner'>
                            <Spinner className='spinner' animation="border" />
                        </div>
                    )
                } else {
                    return (
                        <>
                            <div className='series'>
                                {filteredshow.map(((show, i) => <CardListSerie favoriteBtn={true} id={show.id} openModal={openModal} serieDetail={serieDetail} setSerieDetail={setSerieDetail} modal={true} key={`serieList${i}`} imgUrl={show.images.show} title={show.title}
                                />))}
                            </div>
                            <div className="pagination">
                                {page > 1 &&
                                    <div className="pagination__frame">
                                        <img className="pagination__arrow pagination__arrow--left" src={arrow} onClick={() => handlePagination('prev')} alt="An arrow" />
                                    </div>
                                }
                                {filteredshow.length >= 15 &&
                                    <div className="pagination__frame">
                                        <img className="pagination__arrow pagination__arrow--right" onClick={() => handlePagination('next')} src={arrow} alt="An arrow" />
                                    </div>
                                }

                            </div>
                        </>
                    )
                }

            } else {
                if (isLoading) {
                    return (
                        <div className='wrapper--spinner'>
                            <Spinner className='spinner' animation="border" />
                        </div>
                    )
                } else {
                    return (
                        <>
                            <div className='series'>
                                {show.map(((show, i) => <CardListSerie favoriteBtn={true} id={show.id} modal={true} openModal={openModal} serieDetail={serieDetail} setSerieDetail={setSerieDetail} key={`serieList${i}`} imgUrl={show.images.show} title={show.title} />))}
                            </div>
                            <div className="pagination">
                                {page > 1 &&
                                    <div className="pagination__frame">
                                        <img className="pagination__arrow pagination__arrow--left" src={arrow} onClick={() => handlePagination('prev')} alt="An arrow" />
                                    </div>
                                }
                                {show.length >= 15 &&
                                    <div className="pagination__frame">
                                        <img className="pagination__arrow pagination__arrow--right" onClick={() => handlePagination('next')} src={arrow} alt="An arrow" />
                                    </div>
                                }

                            </div>
                        </>
                    )
                }

            }
        }
    }

    return (
        <>
            <Container>
                <Form className="d-flex" >
                    <Form.Select aria-label="Default select example" value={selectedOption} onChange={handleChange}>
                        {
                            Object.keys(filterList).map((value) => {
                                return (
                                    <option key={`option-${value}`} value={value}>{filterList[value]}</option>
                                )
                            })
                        }
                    </Form.Select>
                    <Form.Control
                        onChange={handleSearchChange}
                        type="search"
                        placeholder="Rechercher une série"
                        className="me-2"
                        aria-label="Search"
                        value={search}
                    />
                </Form>
                <div className="cardcontainer">
                    <GenerateShow />
                </div>
                {modalIsOpen &&
                    <SerieDetail openModal={openModal}
                        closeModal={closeModal}
                        modalIsOpen={modalIsOpen}
                        title="Connexion"
                        errorMessage={errorMessage}
                        serieDetail={serieDetail}
                    />
                }
            </Container>
        </>
    )
}
export default Cat;