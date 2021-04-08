import React from 'react'
import Logo from '../../Assets/logo.png'

const ViewResult = (props) => {

    if (localStorage.getItem("token") === null) {
        props.history.push('/')
    }

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
        <div>
            <div className="backgroundColor">
                <div className="navigation">
                    <img src={Logo} alt="Logo" />
                    <a href="https://www.truebestfriends.com/" target="_blank">Visit Website</a>
                </div>
                <div className="navGrid">
                    <div className="subnav">
                    <button onClick={() => props.history.push('/home')} style={{ color: '#dcdcdc', width:'100%', borderRadius:5, padding:10}}><i style={{ marginRight: 15 }} className="fa fa-table"></i>Quiz</button>
                        <button onClick={() => props.history.push('/createQuiz')} style={{ color: '#dcdcdc', width:'100%', borderRadius:5, padding:10}}><i style={{ marginRight: 15 }} className="fa fa-pencil" />Create Quiz</button>
                        <button onClick={logOut} style={{ color: '#dcdcdc', width:'100%', borderRadius:5, padding:10}}> <i style={{ marginRight: 15 }} className="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
                    </div>
                    <div className="table-container detailView">
                        <div className="card" style={{ marginBottom: 50 }}>
                            <div className="questionNumber">
                               <h1>{props.location.state.data.player_name}</h1>
                            </div>
                            <div className="answerContainer view-design" >
                                <div><span style={{color:"#828282"}}>Score:</span> {props.location.state.data.score}</div>
                            </div>
                            <div className="answerContainer view-design" >
                                <div><span style={{color:"#828282"}}>Played :</span>{getTime(props.location.state.data.play_date)}</div>
                            </div>
                            {
                                props.location.state.data.answers.map((data, i) => {
                                    return <div key={data.answer} className="answerContainer view-design" style={{ backgroundColor: data.isCorrect === true ? "#2ed573" : "red" }}>
                                        <div style={{color:"#fff"}}><span style={{color:'#dcdcdc', marginRight:5}}>Answer<span style={{marginLeft:4}}>{i+1}</span>:</span>{data.answer}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewResult
