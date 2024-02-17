import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

const textBoxStyles = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    display: 'inline-block',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
}

export default function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <main className="bg-gray-900 text-white relative">
                <div
                    className="h-screen flex items-center bg-cover justify-start px-4 md:px-10 lg:px-16 xl:px-24"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                    
                    <div className="max-w-lg ml-4 md:ml-10 lg:ml-20">
                        <div
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#ffffff',
                                padding: '1rem 2rem',
                                borderRadius: '0.5rem',
                            }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                                Mens Sana In Corpore Sano
                            </h1>
                            <p className="mt-4 mb-6 text-base md:text-lg lg:text-xl">
                                Nurture your wellness inside and out with 50%
                                off your first 12 weeks when you join on a 12
                                month membership.
                            </p>
                            <button
                                className="inline-block bg-primary text-white px-6 py-3 text-lg font-bold rounded hover:bg-red-700 transition duration-300"
                                onClick={() => navigate("/register")}
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
