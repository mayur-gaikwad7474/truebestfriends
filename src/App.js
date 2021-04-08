import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './Components/Pages/Login'
import Home from './Components/Pages/Home'
import CreateQuiz from './Components/Pages/CreateQuiz'
import Edit from './Components/Pages/Edit'
import DetailQuiz from './Components/Pages/DetailQuiz'
import Result from './Components/Pages/Result'
//import ViewResult from './Components/Pages/ViewResult'
const ViewResult = React.lazy(() => import('./Components/Pages/ViewResult'));


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
           <Route exact path="/" component={Login} /> 
            <Route exact path="/home" component={Home} />
            <Route exact path="/createquiz" component={CreateQuiz} />
            <Route exact path="/edit" component={Edit} />
            <Route exact path="/detailQuiz" component={DetailQuiz} />
            <Route exact path="/result" component={Result} />
            <Route exact path="/resultview" component={ViewResult} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
