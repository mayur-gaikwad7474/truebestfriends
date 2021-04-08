import Axios from 'axios'
import React, { useState, useEffect } from 'react'
import Logo from '../../Assets/logo.png'
import "../css/createQuiz.css"
import Loading from './Loading'

const CreateQuiz = (props) => {

    if (localStorage.getItem("token") === null) {
        props.history.push('/')
    }

    const logOut = () => {
        localStorage.removeItem("token")
        props.history.push('/')
    }

    const [loading, setloading] = useState(false)
    const [renderPage, setrenderPage] = useState(true)
    const [defaultCount, setdefaultCount] = useState([{ question: 1, options: [0, 1, 2, 3] }])
    const [resultCount, setresultCount] = useState([0, 1])

    const [quiz, setquiz] = useState({
        title: "",
        slug: "",
        cover_image: "",
        language: "en",
        region: "uk",
        questions: [

        ],
        results: [

        ],

    })

    useEffect(() => {

    }, [renderPage, quiz])


    const deleteTheOption = (a, b) => {
        let data = defaultCount
        if (data[a].options.length === 2) return alert("You have to fill minimun two fields")
        data[a].options.splice(-1, 1)
        let data1 = quiz
        if (data1.questions[a] === undefined) {
            setrenderPage((prev) => !prev)
            setdefaultCount(() => data)
        } else if (data1.questions[a].options[b] !== undefined) {
            data1.questions[a].options.splice(b, 1)
            setrenderPage((prev) => !prev)
            setquiz(() => data1)
            setdefaultCount(() => data)
        } else {
            setrenderPage((prev) => !prev)
            setdefaultCount(() => data)
        }
    }

    const addQuestion = () => {
        let count = defaultCount.length + 1
        let data = {
            question: count,
            options: [0, 1, 2, 3]
        }
        let data1 = defaultCount
        data1.push(data)
        setdefaultCount(data1)
        setrenderPage((prev) => !prev)
    }

    const addOption = (a) => {
        let data = defaultCount
        let count = data[a].options.length
        data[a].options.push(count)
        setdefaultCount(data)
        setrenderPage((prev) => !prev)
    }

    const addQuestionObject = (a, e) => {
        if (quiz.questions[a] === undefined) {
            let data = quiz
            let object = {
                question: e.target.value,
                options: [],
                answer: ""
            }
            data.questions.push(object)
            setquiz(() => data)
        } else {
            let data = quiz
            data.questions[a].question = e.target.value
            setquiz(() => data)
        }
        setrenderPage((prev) => !prev)
    }

    const addAnswerObject = (a, b, e) => {
        if (quiz.questions[a] === undefined) return alert("add question first")
        if (quiz.questions[a].options[b] === undefined) {
            let data = quiz
            data.questions[a].options.push(e.target.value)
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        } else {
            let data = quiz
            data.questions[a].options[b] = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const addResult = () => {
        let n = resultCount.length
        let data = resultCount
        data.push(n)
        setresultCount(data)
        setrenderPage((prev) => !prev)
    }

    const addMinScore = (a, e) => {
        if (quiz.results[a] === undefined) {
            let object = {
                min_score: e.target.value,
                max_score: "",
                title: "",
                phrase: ""
            }
            let data = quiz
            data.results.push(object)
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        } else {
            let data = quiz
            data.results[a].min_score = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const addMaxScore = (a, e) => {
        if (quiz.results[a] === undefined) {
            let object = {
                min_score: "",
                max_score: e.target.value,
                title: "",
                phrase: ""
            }
            let data = quiz
            data.results.push(object)
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        } else {
            let data = quiz
            data.results[a].max_score = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const addTitle = (a, e) => {
        if (quiz.results[a] === undefined) {
            let object = {
                min_score: "",
                max_score: "",
                title: e.target.value,
                phrase: ""
            }
            let data = quiz
            data.results.push(object)
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        } else {
            let data = quiz
            data.results[a].title = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const addPhrase = (a, e) => {
        if (quiz.results[a] === undefined) {
            let object = {
                min_score: "",
                max_score: "",
                title: "",
                phrase: e.target.value
            }
            let data = quiz
            data.results.push(object)
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        } else {
            let data = quiz
            data.results[a].phrase = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const addQuizTitle = (e) => {
        let data = quiz
        data.title = e.target.value
        data.slug = e.target.value.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z ]/g, "")
        setquiz(() => data)
        setrenderPage((prev) => !prev)
    }

    const addQuizSlug = (e) => {
        let data = quiz
        data.slug = e.target.value.toLowerCase().replace(/[^a-zA-Z ]/g, "")
        setquiz(() => data)
        setrenderPage((prev) => !prev)
    }

    const uploadImage = (e) => {
        showThePopUp("Image Uploading Started")
        var files = e.target.files[0]
        const url = 'https://api.truebestfriends.com/admin/upload';
        const formData = new FormData();
        formData.append('file', files)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }
        Axios.post(url, formData, config).then(res => {
            if (res.data.status === true) {
                let data = quiz
                data.cover_image = res.data.image_name
                showThePopUp("Image Uploaded")
                setquiz(() => data)
                setrenderPage((prev) => !prev)
            } else {
                showThePopUp("Image Failed To Upload")
            }
        }).catch(err => {
            showThePopUp("Image Failed To Upload")
        })
    }

    const addTickAnswer = (a, b, e) => {
        if (quiz.questions[a] === undefined) {
            e.target.checked = false
            return alert("add question first")
        } else if (quiz.questions[a].options[b] === undefined) {
            e.target.checked = false
            return alert("Please fill the answer then select")
        } else {
            let data = quiz
            data.questions[a].answer = e.target.value
            setquiz(() => data)
            setrenderPage((prev) => !prev)
        }
    }

    const submitQuiz = async (e) => {
        e.preventDefault();
        try {
            let len = quiz.questions.filter(data => {
                if (data.answer === "") return data
            })
            if (len.length >= 1) return alert("plz select all anwsers")
            if (quiz.questions.length < 1) return alert("plz add questions")
            if (quiz.results.length < 1) return alert("plz add result")
            setloading(true)
            let res = await Axios.post("https://api.truebestfriends.com/admin/save_quiz", {
                quiz: quiz
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            setloading(false)
            if (res.data.status === false) return alert("Quiz with same slug available plaz try another slug name")
            if (res.data.status === true) {
                props.history.push('/home')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const selectRegion = (e) => {
        let data = quiz
        data.region = e.target.value
        setquiz(() => data)
        setrenderPage((prev) => !prev)
    }

    const selectLanguage = (e) => {
        let data = quiz
        data.language = e.target.value
        setquiz(() => data)
        setrenderPage((prev) => !prev)
    }

    const deleteTheResult = (a) => {
        let getTheFilterData = resultCount.map((data) => {
            if (data !== a) return data
        })

        let data1 = getTheFilterData.filter(data => data !== undefined)
        let data2 = data1.map((data, i) => {
            return i
        })

        let filterquizDelete = quiz.results.filter((data, i) => {
            if (i !== a) return data
        })

        let data = quiz
        data.results = filterquizDelete
        setquiz(() => data)
        setresultCount(() => data2)
        setrenderPage((prev) => !prev)
    }

    const deleteTheQuestion = (a) => {
        let getTheFilterData = defaultCount.filter(data => {
            if (data.question !== defaultCount[a - 1].question) return data
        })

        let filterquizDelete = quiz.questions.filter((data, i) => {
            if (i !== (a - 1)) return data
        })

        let data = quiz
        data.questions = filterquizDelete

        let defCount = getTheFilterData.map((data, i) => {
            data.question = i + 1
            return data
        })
        setquiz(() => data)
        setdefaultCount(() => defCount)
        setrenderPage((prev) => !prev)
    }

    const showThePopUp = (prompt) => {
        var inp = document.createElement('input');
        document.body.appendChild(inp)
        inp.className = "popUp1"
        inp.select();
        document.execCommand('copy', false);
        inp.value = prompt
        setTimeout(() => {
            inp.remove();
        }, 1000);
    }

    const uploadImage1 = (e, a) => {
        showThePopUp("Image Uploading Started")
        var files = e.target.files[0]
        const url = 'https://api.truebestfriends.com/admin/upload';
        const formData = new FormData();
        formData.append('file', files)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }
        Axios.post(url, formData, config).then(res => {
            if (res.data.status === true) {
                let data = quiz
                quiz.results[a].cover_image = res.data.image_name
                setquiz(() => data)
                setrenderPage((prev) => !prev)
                showThePopUp("Image Uploaded")
            } else {
                showThePopUp("Failed To Upload Image")
            }
        }).catch(err => {
            showThePopUp("Failed To Upload Image")
        })
    }

    return (
        <div className="backgroundColor">
            <div>
                <div className="navigation">
                    <img src={Logo} alt="Logo" />
                    <a href="https://www.truebestfriends.com/" target="_blank">Visit Website</a>
                </div>
                <div className="navGrid">
                    <div className="subnav">
                        <button onClick={() => props.history.push('/home')} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}><i style={{ marginRight: 15 }} className="fa fa-table"></i>Quiz</button>
                        <button onClick={() => props.history.push('/createQuiz')} style={{ color: '#fff', backgroundColor: 'rgb(99,111,143,0.5)', width: '100%', borderRadius: 5, padding: 10 }}  ><i style={{ marginRight: 15 }} className="fa fa-pencil" />Create Quiz</button>
                        <button onClick={logOut} style={{ color: '#dcdcdc', width: '100%', borderRadius: 5, padding: 10 }}> <i style={{ marginRight: 15 }} className="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
                    </div>
                    <div className="table-container detailView">
                        {
                            loading === true ? <Loading /> :
                                <div className="create-quiz-container">
                                    <div className="card">
                                        <div className="questionNumber">
                                            <h1>TITLE</h1>
                                        </div>
                                        <textarea value={quiz.title} className="result" placeholder="Title" onChange={(e) => addQuizTitle(e)} />
                                    </div>
                                    <div className="card">
                                        <div className="questionNumber">
                                            <h1>SLUG</h1>
                                        </div>
                                        <textarea value={quiz.slug} className="result" placeholder="Slug" onChange={(e) => addQuizSlug(e)} />
                                    </div>
                                    <div className="card">
                                        <div className="questionNumber">
                                            <h1>REGION</h1>
                                        </div>
                                        <select name="region" id="region" className="result" style={{ padding: 10 }} onChange={(e) => selectRegion(e)} >
                                            <option value="us">United States</option>
                                            <option value="sk">United Kingdom</option>
                                            <option value="eu">Europe</option>
                                            <option value="sa">South America</option>
                                            <option value="jp">Japan</option>
                                            <option value="au">Australia</option>
                                            <option value="za">South Africa</option>
                                            <option value="ca">Canada</option>
                                            <option value="sg">Singapore</option>
                                            <option value="in">India</option>
                                        </select>
                                    </div>
                                    <div className="card">
                                        <div className="questionNumber">
                                            <h1>LANGUAGE</h1>
                                        </div>
                                        <select name="lang" id="lang" className="result" style={{ padding: 10 }} onChange={(e) => selectLanguage(e)} >
                                            <option value="en">English</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                            <option value="it">Italiano</option>
                                            <option value="nl">Dutch</option>
                                            <option value="es">Español</option>
                                            <option value="pt">Português</option>
                                        </select>
                                    </div>
                                    <div className="card">
                                        <img style={{ height: 200, width: 200, marginBottom: 10, borderRadius: 10, objectFit: 'contain', alignSelf: 'center' }}
                                            src={quiz.cover_image === "" ? "" : `https://cdn.truebestfriends.com/uploads/${quiz.cover_image}`}
                                            alt="" />
                                        <div className="questionNumber">
                                            <h1>UPLOAD</h1>
                                        </div>
                                        <div className="result" style={{ backgroundColor: '#fff' }}>
                                            {quiz.cover_image === "" ? "Please Upload File" : quiz.cover_image}
                                        </div>
                                        <label class="fileContainer" style={{ marginTop: 10 }}>
                                            Select Image
                                            <input type="file" onChange={(e) => uploadImage(e)} />
                                        </label>
                                    </div>
                                    {
                                        defaultCount.map(data => {
                                            return <div key={data.question}>
                                                <div className="card">
                                                    <div className="questionNumber">
                                                        <h1>QUESTION {data.question}</h1>
                                                    </div>
                                                    <div className="questionNumber1">
                                                        <button className="delete" onClick={() => deleteTheQuestion(data.question)}>X</button>
                                                    </div>
                                                    <textarea value={quiz.questions[data.question - 1] === undefined ? "" : quiz.questions[data.question - 1].question} className="question" placeholder="Enter Question" onChange={(e) => addQuestionObject(data.question - 1, e)} />
                                                    {
                                                        data.options.map((data1, i) => {
                                                            return <div key={data.question + data1} className="answerContainer">
                                                                <input type="radio" name={quiz.questions[data.question - 1] === undefined ? "" : quiz.questions[data.question - 1].question} value={quiz.questions[data.question - 1] === undefined ? "" : quiz.questions[data.question - 1].options[data1]} onChange={(e) => addTickAnswer(data.question - 1, data1, e)} />
                                                                <textarea className="answer" placeholder="answer" value={quiz.questions[data.question - 1] === undefined ? "" : quiz.questions[data.question - 1].options[data1]} onChange={(e) => addAnswerObject(data.question - 1, data1, e)} />
                                                                <button className="delete" onClick={() => deleteTheOption(data.question - 1, data1)}>X</button>
                                                            </div>
                                                        })
                                                    }
                                                    <button className="add-option" onClick={() => addOption(data.question - 1)}>Add option</button>
                                                </div>
                                            </div>
                                        })
                                    }
                                    <button className="addQuestion" onClick={() => addQuestion()}>Add Question</button>
                                    {
                                        resultCount.map(data => {
                                            return <div className="card">
                                                {
                                                    quiz.results[data] === undefined ? null : <img style={{ height: 200, width: 200, marginBottom: 10, borderRadius: 10, objectFit: 'contain', alignSelf: 'center' }}
                                                        src={`https://cdn.truebestfriends.com/uploads/${quiz.results[data].cover_image}`} alt="" />
                                                }
                                                <div className="questionNumber">
                                                    <h1>RESULT {data + 1}</h1>
                                                </div>
                                                <div className="questionNumber1">
                                                    <button className="delete" onClick={() => deleteTheResult(data)}>X</button>
                                                </div>
                                                <textarea value={quiz.results[data] === undefined ? "" : quiz.results[data].min_score} className="result" placeholder="Min Score" onChange={(e) => addMinScore(data, e)} />
                                                <textarea value={quiz.results[data] === undefined ? "" : quiz.results[data].max_score} style={{ marginTop: 10 }} className="result" placeholder="Max Score" onChange={(e) => addMaxScore(data, e)} />
                                                <textarea value={quiz.results[data] === undefined ? "" : quiz.results[data].title} style={{ marginTop: 10 }} className="result" placeholder="Title" onChange={(e) => addTitle(data, e)} />
                                                <textarea value={quiz.results[data] === undefined ? "" : quiz.results[data].phrase} style={{ marginTop: 10 }} className="result" placeholder="Phrase" onChange={(e) => addPhrase(data, e)} />
                                                <div className="result" style={{ backgroundColor: '#fff' }} style={{ marginTop: 10 }}>
                                                    {quiz.results[data] === undefined ? "select image" : quiz.results[data].cover_image}
                                                </div>
                                                <label className="fileContainer" style={{ marginTop: 10 }}>
                                                    Select Image
                                                  <input type="file" onChange={(e) => uploadImage1(e, data)} />
                                                </label>
                                            </div>
                                        })
                                    }
                                    <button className="addQuestion" onClick={() => addResult()}>Add result</button>
                                    <button className="submit" onClick={(e) => submitQuiz(e)}>SAVE</button>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateQuiz
