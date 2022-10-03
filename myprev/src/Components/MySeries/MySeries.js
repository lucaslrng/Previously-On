import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardListSerie from "../CardSerieList/CardListSerie";
import Container from "react-bootstrap/esm/Container";
import { Spinner } from 'react-bootstrap';


const MySeries = () => {
    const [showList, setShowList] = useState([]);
    const userId = useSelector((state) => state.user.id);
    
    
    // GET LA LISTE
    useEffect(() => {
        // console.log('premier showlist'+showList);
        axios({
            method: "GET",
            url: `https://api.betaseries.com/shows/member?id=${userId}`,            
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                const list = Object.values(res.data.shows)
                setShowList(list)
                // console.log('second showlist'+showList)
            }).catch(err => console.log(err))
    }, [])

    return(
        <>
        <Container>
        <h1>Mes Séries</h1>
        {
            showList.length > 0 ?
            
            <div className="series">
            {showList.map(((show, i) => <CardListSerie delBtn={true} id={show.id} setShowList={setShowList} key={`serieList${i}`} imgUrl={show.images.show} title={show.title} redirect={true} />))}
            </div>
            :
            <div className='wrapper--spinner'>
            <Spinner className='spinner' animation="border" />
            </div>
        }    
        </Container>
        </>
    )
}

export default MySeries;