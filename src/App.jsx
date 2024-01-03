import Header from "./components/Header/Header"
import Constructor from "./pages/Constructor/Constructor";
import Feed from './pages/Feed/Feed';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NoPage from "./pages/NoPage/NoPage";




function App() {



  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Constructor />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="*" element={<NoPage/>} />
      </Routes>

    </>
  )
};

export default App;
