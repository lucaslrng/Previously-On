import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import './stylefriend.css'


let controller
const MyFriend = () => {
    const [searchFriendList, setSearchFriendList] = useState([]);
    const [friendId, setFriendId] = useState();
    const [friendList, setFriendList] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const token = useSelector((state) => {
        if (state.token != null) {
            return state.token
        }
    });

    useEffect(() => {
        
            axios({
                method: "GET",
                url: `https://api.betaseries.com/friends/list?token=${token}`,
                headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
            })
                .then(res => {
                    // console.log(res.data.users);
                    setFriendList(res.data.users);
                }).catch(err => { console.log(err) })
        
        
    }, [])
    useEffect(() => {
        axios({
            method: "GET",
            url: `https://api.betaseries.com/friends/list?token=${token}&blocked=true`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                // console.log(res);
                setBlocked(res.data.users)
            }).catch(err => { console.log(err) })
    }, [])
    const searchFriend = (e) => {
        const searchMail = e.target.value

        if (searchMail.length === 0) {
            setSearchFriendList([])
        } else {
            if (controller) {
                controller.abort()
            }
            controller = new AbortController();
            axios({
                method: "GET",
                url: `https://api.betaseries.com/friends/find?type=emails&token=${token}&emails=${searchMail}`,
                headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` },
                signal: controller.signal
            })
                .then(res => {
                    setSearchFriendList(res.data.users);
                    setFriendId(res.data.users[0].id);
                    // console.log(friendId);
                    // console.log(searchFriendList);
                }).catch(err => console.log(err))

        }
    }
    const addFriend = () => {
        axios({
            method: "POST",
            url: `https://api.betaseries.com/friends/friend?token=${token}&id=${friendId}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                console.log(res.data.member)  
                setFriendList((state) => {
                    return [...state, res.data.member]
                })
            }).catch(err => console.log(err))
    }
    function delFriend(id) {
        axios({
            method: "DELETE",
            url: `https://api.betaseries.com/friends/friend?id=${id}&token=${token}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                setFriendList((state) => {
                    return state.filter(e => e.id != id)
                })
            }).catch(err => { console.log(err) })
    }
    function blockFriend(id) {
        axios({
            method: "POST",
            url: `https://api.betaseries.com/friends/block?id=${id}&token=${token}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                console.log(res);
                setBlocked((state) => {
                    return [...state, res.data.member]
                })
                setFriendList((state) => {
                    return state.filter(e => e.id != id)
                })
            }).catch(err => { console.log(err); })
    }
    function unBlockFriend(id) {
        axios({
            method: "DELETE",
            url: `https://api.betaseries.com/friends/block?id=${id}&token=${token}`,
            headers: { "X-BetaSeries-Key": `${process.env.REACT_APP_API_KEY}` }
        })
            .then(res => {
                setBlocked((state) => {
                    return state.filter(e => e.id != id)
                })
            }).catch(err => { console.log(err) })
    }


    return (
        <>
            <Container>
                <div className="all">
                    <div className="top">
                        <Form className="d-flex" >
                            <Form.Control
                                onChange={searchFriend}
                                type="search"
                                placeholder="Rechercher une personne"
                                className="me-2"
                                aria-label="Search"
                            />
                        </Form>
                        {
                            searchFriendList.length > 0 ?
                                <div className="cardcontainer">
                                    {
                                        searchFriendList.map((friend) => {
                                            return (
                                                <div className="friend">
                                                    <p>Mail: {friend.name}</p>
                                                    <p>Pseudo: {friend.login}</p>
                                                    {/* <p>Pseudo: {friend.id}</p>    */}
                                                    <button onClick={addFriend}>Ajouter</button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <div className="spin">
                                    <Spinner className='spinner' animation="border" />
                                </div>
                                
                        }
                    </div>
                    <div className="bot">
                    {
                        friendList.length > 0 ?
                            <div className="friendlist" >
                                <h1>Mes amis</h1>
                                {
                                    friendList.map((friend) => {
                                        return (
                                            <div className="listdiv">
                                                <p className="name">{friend.login}</p>
                                                <div className="friendbtn">
                                                <button onClick={() => delFriend(friend.id)}>Supprimer</button>
                                                <button onClick={() => blockFriend(friend.id)}>Bloquer</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div></div>
                    }

                    {
                        blocked.length > 0 ?
                            <div className="blocklist">
                                <h1>Personnes bloquées</h1>
                                {
                                    blocked.map((block) => {
                                        return (
                                            <div className="listdiv">
                                                <p className="name">{block.login}</p>
                                                <button className="friendbtn" onClick={() => unBlockFriend(block.id)}>Débloquer</button>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div></div>
                    }
                    </div>
                </div>
            </ Container>
        </>
    )
}

export default MyFriend;