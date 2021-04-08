import React, { useState, useEffect } from 'react'
import Logo from '../../Assets/logo.png'
import Axios from 'axios'
import Loading from './Loading'
import '../css/detailView.css'


const DetailQuiz = (props) => {
    const [loading, setloading] = useState(true)
    const [quiz, setquiz] = useState([])

    const getSingleQuiz = async () => {
        try {
            let res = await Axios.get(`https://api.truebestfriends.com/admin/get_quiz?guid=${props.location.state.id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })

            setquiz(res.data.data)
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
                <div className="table-container detailView">
                    {
                        loading === true ? <Loading /> : <div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>IMAGE</h1>
                                </div>
                                <img
                                    style={{ width: 200, height: 200, objectFit: 'contain', alignSelf: 'center', borderRadius: 10, marginBottom: 10 }}
                                    src={`https://cdn.truebestfriends.com/uploads/${quiz.cover_image}`} alt="" />
                                {quiz.cover_image}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>GUID</h1>
                                </div>
                                {quiz.guid}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>ID</h1>
                                </div>
                                {quiz.id}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>TITLE</h1>
                                </div>
                                {quiz.title}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>SLUG</h1>
                                </div>
                                {quiz.slug}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>ACTIVE</h1>
                                </div>
                                {quiz.is_active}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>CREATED</h1>
                                </div>
                                {quiz.date_created}
                            </div>
                            <div className="card">
                                <div className="questionNumber">
                                    <h1>UPDATED</h1>
                                </div>
                                {quiz.date_updated}
                            </div>
                            {
                                quiz.quizdata.map((data, i) => {
                                    return <div className="card" key={data.question}>
                                        <div className="questionNumber">
                                            <h1 >QUESTION {i + 1}</h1>
                                        </div>
                                        <div className="question">{data.question}</div>
                                        {
                                            data.options.map(data => {
                                                return <div className="answerContainer view-design">
                                                    <div className="answer"> {data} </div>
                                                </div>
                                            })
                                        }
                                        <div className="answerContainer view-design color-answer" >{data.answer}</div>
                                    </div>
                                })
                            }
                            {
                                quiz.results === null ? null :
                                quiz.results.map(data => {
                                    return <div className="card" key={data.title}>
                                        <div className="questionNumber">
                                            <h1>Result</h1>
                                        </div>
                                        <div className="answerContainer view-design">
                                            <span style={{ color: '#828282' }}>Min Score:</span>
                                            <span style={{ marginLeft: 5 }}>{data.min_score}</span>
                                        </div>
                                        <div className="answerContainer view-design">
                                            <span style={{ color: '#828282' }}>Max Score:</span>
                                            <span style={{ marginLeft: 5 }}>{data.max_score}</span>
                                        </div>
                                        <div className="answerContainer view-design">
                                            <span style={{ color: '#828282' }}>Phrase:</span>
                                            <span style={{ marginLeft: 5 }}>{data.phrase}</span>
                                        </div>
                                        <div className="answerContainer view-design">
                                            <span style={{ color: '#828282' }}>Title:</span>
                                            <span style={{ marginLeft: 5 }}>{data.title}</span>
                                        </div>
                                    </div>
                                })
                            }
                            <button className="editButton" onClick={() => props.history.push({
                                pathname: '/edit',
                                state: { id: props.location.state.id }
                            })}>Edit</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default DetailQuiz


