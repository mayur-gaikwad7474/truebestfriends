import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import "../css/Home.css"
import Logo from '../../Assets/logo.png'
import Loading from './Loading'
import qs from 'query-string'

const Home = (props) => {

    const [allQuiz, setAllQuiz] = useState([])
    const [limitCount, setlimitCount] = useState(0)
    const [loading, setloading] = useState(true)
    const [searchQuery, setsearchQuery] = useState("")

    const getAllQuiz = async () => {
        try {
            setloading(true)
            let limitCount = localStorage.getItem('limit')
            let limit = 0
            if (limitCount !== null) {
                limit = parseInt(limitCount) * 10
            }
            let data = await Axios.get(`https://api.truebestfriends.com/admin/get_all_quiz?limit=10&offset=${limit}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            setAllQuiz(data.data.quiz)
            setloading(false)
        } catch (error) {
            setloading(true)
            alert(error.message)
        }
    }

    const searchQuiz = async () => {
        try {
            setloading(true)
            let data = await Axios.get(`https://api.truebestfriends.com/admin/get_all_quiz?limit=10&offset=0&search=${searchQuery}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            setAllQuiz(data.data.quiz)
            setloading(false)
        } catch (error) {
            console.log(error)
            setloading(true)
            alert(error.message)
        }
    }

    const next = async () => {
        try {
            setloading(true)
            let next = (limitCount + 1) * 10
            let data = await Axios.get(`https://api.truebestfriends.com/admin/get_all_quiz?limit=10&offset=${next}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (data.data.quiz.length === 0) setloading(false)
            if (data.data.quiz.length === 0) return alert("No more quiz to show")
            setloading(false)
            localStorage.setItem('limit', limitCount + 1)
            setlimitCount((prev) => prev + 1)
            setAllQuiz(data.data.quiz)
        } catch (error) {
            setloading(false)
        }
    }

    const prev = async () => {
        setloading(true)
        let next = (limitCount - 1) * 10
        if ((limitCount - 1) === -1) setloading(false)
        if ((limitCount - 1) === -1) return alert("You are on first page")
        let data = await Axios.get(`https://api.truebestfriends.com/admin/get_all_quiz?limit=10&offset=${next}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        setloading(false)
        localStorage.setItem('limit', limitCount - 1)
        if (next !== -1) {
            setlimitCount((prev) => prev - 1)
        }
        setAllQuiz(data.data.quiz)
    }

    const getConfirmation = async (id) => {
        let returnValue = window.confirm("Do you want to delete quiz ?");
        if (returnValue === true) {
            try {
                const body = {};
                setloading(true)
                const res = await Axios.post(`https://api.truebestfriends.com/admin/delete_quiz/${id}`, body, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                let removedQuizData = allQuiz.filter(data => {
                    if (data.guid !== id) return data
                })
                setloading(false)
                setAllQuiz(removedQuizData)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("canceled")
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            props.history.push('/')
        } else {
            getAllQuiz()
            if (localStorage.getItem("limit") !== null) {
                setlimitCount(parseInt(localStorage.getItem("limit")))
            }
        }
        window.onbeforeunload = confirmExit;
        function confirmExit() {
            window.localStorage.removeItem('limit');
        }
    }, [])

    const logOut = () => {
        localStorage.removeItem("token")
        props.history.push('/')
    }

    const copyUrl = (slug, e) => {
        var inp = document.createElement('input');
        document.body.appendChild(inp)
        inp.value = `https://www.truebestfriends.com/quiz/${slug}`
        inp.className = "popUp"
        inp.select();
        document.execCommand('copy', false);
        inp.value = "URL Copied"
        setTimeout(() => {
            inp.remove();
        }, 1000);
    }

    const changeStatus = async (id, active) => {
        try {
            let status = active === "1" ? "pause" : "play"
            const requestBody = {
                guid: id,
                status: status
            }
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
            let res = await Axios.post('https://api.truebestfriends.com/admin/update_status', qs.stringify(requestBody), config)
            let filterquiz = allQuiz.map(data => {
                if (data.guid === id) {
                    data.is_active = data.is_active === "1" ? "0" : "1"
                    return data
                } else {
                    return data
                }
            })
            setAllQuiz(filterquiz)
        } catch (error) {

        }
    }

    const changePrioity = async (id, active) => {
        try {
            let len = allQuiz.filter(data => {
                if (data.guid === id) return data
            })
            setloading(true)
            let data = len[0]
            data.is_editors_pick = data.is_editors_pick === "0" ? "1" : "0"
            let res = await Axios.post(`https://api.truebestfriends.com/admin/toggle_priority/${id}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const filterArray = allQuiz.map(quiz => {
                if (quiz.guid === id) {
                    return data
                } else {
                    return quiz
                }
            })
            setAllQuiz(filterArray)
            setloading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="home-container">
            <div className="backgroundColor">
                <div className="navigation">
                    <img src={Logo} alt="Logo" />
                    <div className="search">
                        <input type="text" placeholder="Search" onChange={(e) => setsearchQuery(e.target.value)} />
                        <button onClick={searchQuiz}>Search</button>
                    </div>
                    <a href="https://www.truebestfriends.com/" target="_blank">Visit Website</a>
                </div>
                <div className="navGrid">
                    <div className="subnav">
                        <button onClick={() => props.history.push('/home')} style={{ color: '#fff', backgroundColor: 'rgb(99,111,143,0.5)', width: '100%', borderRadius: 5, padding: 10 }}><i style={{ marginRight: 15 }} className="fa fa-table"></i>Quiz</button>
                        <button onClick={() => props.history.push('/createQuiz')} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}><i style={{ marginRight: 15 }} className="fa fa-pencil" />Create Quiz</button>
                        <button onClick={logOut} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}> <i style={{ marginRight: 15 }} className="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
                    </div>
                    <div className="table-container detailView1">
                        {
                            loading === true ? <Loading /> :

                                <div className="cardTable">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Slug</th>
                                                <th>Language</th>
                                                <th>Priority</th>
                                                <th>Attempted</th>
                                                <th>Active</th>
                                                <th>View</th>
                                                <th>Results</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                                <th>URL</th>
                                            </tr>
                                            {
                                                allQuiz.map(data => {
                                                    return <tr key={data.id}>
                                                        <td style={{ width: 60 }}>{data.id}</td>
                                                        <td style={{ width: 340 }}>{data.title}</td>
                                                        <td>{data.slug}</td>
                                                        <td style={{ width: 100 }}>{data.language}</td>
                                                        <td style={{ width: 60 }} onClick={() => changePrioity(data.guid, data.is_editors_pick)}>
                                                            {data.is_editors_pick === "0" ?
                                                                <i className="fa fa-toggle-off" style={{ fontSize: 18, color: 'red' }} /> :
                                                                <i className="fa fa-toggle-on" style={{ fontSize: 18, color: 'green' }} />
                                                            }
                                                        </td>
                                                        <td style={{ width: 60 }}>{data.attempted}</td>
                                                        <td style={{ width: 60 }} onClick={() => changeStatus(data.guid, data.is_active)}>
                                                            {data.is_active === "0" ?
                                                                <i className="fa fa-toggle-off" style={{ fontSize: 18, color: 'red' }} /> :
                                                                <i className="fa fa-toggle-on" style={{ fontSize: 18, color: 'green' }} />
                                                            }
                                                        </td>
                                                        <td style={{ width: 60, color: '#2E3443' }} onClick={() => props.history.push({
                                                            pathname: '/detailQuiz',
                                                            state: { id: data.guid }
                                                        })}><i className="fa fa-eye" style={{ fontSize: 18, color: '#2E3443' }} /></td>
                                                        <td style={{ width: 60 }} onClick={() => props.history.push({
                                                            pathname: '/result',
                                                            state: { id: data.guid }
                                                        })}><i className="fa fa-trophy" style={{ color: '#2E3443', fontSize: 18 }} /></td>
                                                        <td style={{ width: 60 }} onClick={() => props.history.push({
                                                            pathname: '/edit',
                                                            state: { id: data.guid }
                                                        })}><i className="fa fa-pencil-square-o	" style={{ color: '#2E3443', fontSize: 18 }} /></td>
                                                        <td style={{ width: 60 }} onClick={() => getConfirmation(data.guid)}><i className="fa fa-trash" style={{ color: '#2E3443', fontSize: 18 }} /></td>
                                                        <td style={{ width: 60 }} onClick={(e) => copyUrl(data.slug, e)}><i className="fa fa-copy" style={{ fontSize: 18 }} /></td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <div className="pagination">
                                        <button onClick={prev}>Previous</button>
                                        <div>{limitCount + 1}</div>
                                        <button onClick={next}>Next</button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
