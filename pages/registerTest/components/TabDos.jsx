'use client'
import React from "react";
import styles from "@/app/styles/Carrousell.module.css"
import tabDos from "./tabDos.module.css"

const Acerca = () => {

    return (
        <>
            <h2>Acerca de:</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque harum maxime quisquam, rem necessitatibus
                mollitia impedit quos tempora officia ratione at nobis pariatur! Voluptatibus nam laborum harum nisi suscipit. </p>

        </>

    )
}
const Discusion = () => {

    return (
        <>
            <h2>Discusión</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque harum maxime quisquam, rem necessitatibus
                mollitia impedit quos tempora officia ratione at nobis pariatur! Voluptatibus nam laborum harum nisi suscipit. </p>
        </>

    )
}
const Momentos = () => {

    return (
        <>
            <h2>Momentos Eureka</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque harum maxime quisquam, rem necessitatibus
                mollitia impedit quos tempora officia ratione at nobis pariatur! Voluptatibus nam laborum harum nisi suscipit. </p>
        </>

    )
}

const Principios = () => {

    return (
        <>
            <h2>Principios</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque harum maxime quisquam, rem necessitatibus
                mollitia impedit quos tempora officia ratione at nobis pariatur! Voluptatibus nam laborum harum nisi suscipit. </p>        </>

    )
}

const Participantes = () => {

    return (
        <>
            <h2>Participantes</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eaque harum maxime quisquam, rem necessitatibus
                mollitia impedit quos tempora officia ratione at nobis pariatur! Voluptatibus nam laborum harum nisi suscipit. </p>
        </>

    )
}


const Tabs = ({ config }) => {
    const [activeTab, setActiveTab] = React.useState(0);


    return (

        <div className={tabDos.tabDos}>
            <div className={tabDos.tabDosheaders}>
                {

                    config.map((entry, index) => (
                        <div className={tabDos.tabDosheader }>
                            <div className={`tabDos.tabDosheader ${activeTab === index ? "active" : ""}`}
                                onClick={() => setActiveTab(index)}

                            >
                                {entry.header}

                            </div>
                        </div>

                    ))
                }
            </div>
            <div className={tabDos.tabDosbody}>
                {config[activeTab].component}
            </div>
        </div>

    )

}

const App = () => {

    return (
        <Tabs
            config={[

                { header: "Acerca de", component: <Acerca /> },
                { header: "Discusión", component: <Discusion /> },
                { header: "Momentos Eureka", component: <Momentos /> },
                { header: "Principios", component: <Principios /> },
                { header: "Participantes", component: <Participantes /> }
            ]}


        />

    )
}

export default App

