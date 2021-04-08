import React, { useState, useEffect } from 'react'
import Logo from '../../Assets/logo.png'
import Axios from 'axios'
import Loading from './Loading'
import '../css/detailView.css'


const Result = (props) => {
    const [loading, setloading] = useState(true)
    const [result, setresult] = useState([])

    const getSingleQuiz = async () => {
        try {
            let res = await Axios.get(`https://api.truebestfriends.com/admin/quiz_result?guid=${props.location.state.id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(res)
            setresult(res.data.data)
            setloading(false)
        } catch (error) {
            setloading(true)
            alert(error.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            props.history.push('/')
        } else {
            getSingleQuiz()
        }
    }, [])

    const logOut = () => {
        localStorage.removeItem("token")
        props.history.push('/')
    }

    const getTime = (date) => {
        var date = new Date(date);
        var dateStr =
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " On " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2);
        return dateStr
    }

    return (
        <div className="backgroundColor">
            <div className="navigation">
                <img src={Logo} alt="Logo" />
                <a href="https://www.truebestfriends.com/" target="_blank">Visit Website</a>
            </div>
            <div className="navGrid">
                <div className="subnav">
                    <button onClick={() => props.history.push('/home')} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}><i style={{ marginRight: 15 }} className="fa fa-table"></i>Quiz</button>
                    <button onClick={() => props.history.push('/createQuiz')} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}><i style={{ marginRight: 15 }} className="fa fa-pencil" />Create Quiz</button>
                    <button onClick={logOut} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}> <i style={{ marginRight: 15 }} className="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
                </div>
                <div className="table-container detailView1">
                    {
                        loading === true ? <Loading /> :
                            <div className="table-container" style={{ width: '100%' }}>
                                <div className="cardTable">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>ID</th>
                                                <th>Player Name</th>
                                                <th>Played At</th>
                                                <th>Score</th>
                                                <th className="view">View</th>
                                            </tr>
                                            {
                                                result.map(data => {
                                                    return <tr key={data.id}>
                                                        <td>{data.id}</td>
                                                        <td>{data.player_name}</td>
                                                        <td>{getTime(data.play_date)}</td>
                                                        <td>{data.score}</td>
                                                        <td className="view" style={{ color: '#2E3443' }} onClick={() => {
                                                            props.history.push({
                                                                pathname: '/resultview',
                                                                state: { data: data }
                                                            })
                                                        }}><i className="fa fa-eye" style={{ fontSize: 18, color: '#2E3443' }} /></td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Result