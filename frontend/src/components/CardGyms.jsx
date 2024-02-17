export default function CardGyms(props){
    return(
        <div>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-8">
            <div className="md:flex">
                <div className="md:shrink-0">
                    <img className="h-48 w-full object-cover md:h-full md:w-48" src={props.item.imageUrl} alt={props.item.title}/>
                </div>
            <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-gray-900 font-semibold py-2"><i className="fa-solid fa-map-pin pr-2 text-red-700"></i>{props.item.location}</div>
                <a
                    className="font-montserrat text-gray-600 py-2"
                    href={props.item.googleMapsUrl}>View On Google Maps</a>
                    <h4 className="block pt-6 text-lg leading-tight font-medium text-black">{props.item.title}</h4>
                    <p className="mt-2 text-slate-500">{props.item.description}</p>
                </div>
            </div>
        </div>
        </div>  
    )
}