import { useState, createContext } from "react";
import axios from "axios";

const ClimaContext = createContext()

const ClimaProvider = ({children}) => {

    //console.log(import.meta.env.VITE_API_KEY)

    const [busqueda, setBusqueda] = useState({
        ciudad: '',
        pais: ''
    })

    const [resultado, setResultado] = useState({})
    const [cargando, setCargando] = useState(false)
    const [noResultado, setNoResultado] = useState(false)

    const datosBusqueda = e => {
        setBusqueda({
            ...busqueda,
            [e.target.name]: e.target.value
        })
    }

    const consultarClima = async datos => {
        setCargando(true)
        setNoResultado(false)
        try{

            //Extraemos la ciudad y pais y los guardamos en datos
            const { ciudad, pais } = datos

            //Guardamos la url de nuestra variable de entorno en appId
            const appId = import.meta.env.VITE_API_KEY

            //Definimos la url dentro de una variable, se inyecta la ciudad, pais y appId para poder realizar la consulta
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appId}`

            //Extraemos los valores de la url con axios, nos va a retornar un arreglo de objetos
            const { data } = await axios(url)

            //console.log(data)
            //Extraemos la longitud y latitud de la ciudad
            const { lat, lon } = data[0]

            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: clima } = await axios(urlClima)
            setResultado(clima)

            

        }catch(error){
            setNoResultado('No hay resultados')
        } finally{
            setCargando(false)
        }

        
    }
    
    return (
        <ClimaContext.Provider
            value ={{
                busqueda,
                datosBusqueda,
                consultarClima,
                resultado,
                cargando,
                noResultado
            }}
        >
            {children}
        </ClimaContext.Provider>   
    )

}

export {
    ClimaProvider
}

export default ClimaContext
