import { Outlet, Link } from 'react-router-dom'
import './App.css'
import Nav from './containers/Nav'

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1><Link to="/">Haggard</Link></h1>
                <Nav />
            </header>
            <hr />
            <Outlet />
        </div>
  );
}

export default App;
