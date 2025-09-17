import React from 'react'
import Game from './Game'
import OrientationNotice from './components/OrientationNotice'

export default function App() {
return (

<div className="container text-center mt-3">
    <OrientationNotice />
<Game />
</div>
)
}