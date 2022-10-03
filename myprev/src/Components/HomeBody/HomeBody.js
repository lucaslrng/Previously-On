import axios from 'axios';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import CardListSerie from '../CardSerieList/CardListSerie';
import './homebody.css'
function HomeBody(props) {
    const [newSeries, setNewSeries] = React.useState([])
    
    React.useEffect(() => {
        if (newSeries.length === 0) {
            axios.get('https://api.betaseries.com/news/last?number=20', {headers: {"X-BetaSeries-Key": process.env.REACT_APP_API_KEY }})
                .then(response => {
                    setNewSeries(response.data.news)
                })
                .catch(error => console.log(error))
        }
    })


    return (
        <div className='home__body container'>
            <h1 className='home__title'>Les actualités</h1>
            {newSeries.length > 0 ?
                (<div className='series'>
                    {newSeries.map(((serie, i) => <CardListSerie link={serie.url} key={`serieList${i}`} imgUrl={serie.picture_url} title={serie.title} />))}
                </div>) :
                (<div className='wrapper--spinner'>
                    <Spinner className='spinner'animation="border" />
                </div>)
            }
        </div>
    );
}

export default HomeBody;