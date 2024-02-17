import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import data from "../assets/data"
import CardGyms from "../components/CardGyms"

const cards = data.map((item) => {
    return <CardGyms
            key={item.id}
            item={item}
            />
})

export default function Gyms(){
    return(
        <div>
            <Navbar/>
            <div>
            {cards}
            </div>
            <Footer/>
        </div>
    )
}