import './App.css';
import { Route } from "react-router-dom";
import HomePage from './Pages/HomePage';
import ChartPage from './Pages/ChartPage';

function App() {
  return (
    <div className="App">
      <Route path='/' component = {HomePage} exact/>
      <Route path='/chats' component = {ChartPage} />
    </div>
  );
}

export default App;
